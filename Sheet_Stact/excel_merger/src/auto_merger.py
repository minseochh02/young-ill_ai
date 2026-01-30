import time
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
from src.excel_merger import ExcelMerger
import threading

class ExcelFileHandler(FileSystemEventHandler):
    def __init__(self, merger: ExcelMerger, gui_callback=None):
        self.merger = merger
        self.gui_callback = gui_callback
        self.debounce_timer = None
        self.debounce_delay = 2.0  # 2초 디바운스
        
    def on_created(self, event):
        if not event.is_directory and event.src_path.endswith(('.xlsx', '.xls', '.csv')):
            print(f"새 파일 감지: {event.src_path}")
            self.schedule_merge()
            
    def on_modified(self, event):
        if not event.is_directory and event.src_path.endswith(('.xlsx', '.xls', '.csv')):
            print(f"파일 수정 감지: {event.src_path}")
            self.schedule_merge()
            
    def schedule_merge(self):
        """디바운스를 적용한 병합 스케줄링"""
        if self.debounce_timer:
            self.debounce_timer.cancel()
            
        self.debounce_timer = threading.Timer(self.debounce_delay, self.execute_merge)
        self.debounce_timer.start()
        
    def execute_merge(self):
        """실제 병합 실행"""
        try:
            print("자동 병합 실행 중...")
            self.merger.process_all_groups()
            
            if self.gui_callback:
                self.gui_callback("auto_merge_complete")
                
        except Exception as e:
            print(f"자동 병합 오류: {e}")
            if self.gui_callback:
                self.gui_callback("auto_merge_error", str(e))

class AutoMerger:
    def __init__(self, watch_folder: str, output_folder: str, gui_callback=None):
        self.watch_folder = watch_folder
        self.output_folder = output_folder
        self.merger = ExcelMerger(watch_folder, output_folder)
        self.observer = None
        self.gui_callback = gui_callback
        self.is_running = False
        
    def start_watching(self):
        """파일 감시 시작"""
        if self.is_running:
            return
            
        self.is_running = True
        event_handler = ExcelFileHandler(self.merger, self.gui_callback)
        self.observer = Observer()
        self.observer.schedule(event_handler, self.watch_folder, recursive=False)
        self.observer.start()
        
        print(f"파일 감시 시작: {self.watch_folder}")
        
    def stop_watching(self):
        """파일 감시 중지"""
        if not self.is_running:
            return
            
        self.is_running = False
        if self.observer:
            self.observer.stop()
            self.observer.join()
            self.observer = None
            
        print("파일 감시 중지")
        
    def manual_merge(self):
        """수동 병합 실행"""
        try:
            self.merger.process_all_groups()
            return True
        except Exception as e:
            print(f"수동 병합 오류: {e}")
            return False