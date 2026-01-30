import tkinter as tk
from tkinter import filedialog, messagebox, ttk
import customtkinter as ctk
import threading
import os
import time
from src.excel_merger import ExcelMerger
from src.auto_merger import AutoMerger

class ExcelMergerGUI:
    def __init__(self):
        ctk.set_appearance_mode("light")
        ctk.set_default_color_theme("blue")
        
        self.root = ctk.CTk()
        self.root.title("엑셀 시트 병합기")
        self.root.geometry("600x500")
        
        self.watch_folder = ""
        self.output_folder = ""
        self.merger = None
        self.auto_merger = None
        self.auto_mode = False
        
        self.setup_ui()
        
    def setup_ui(self):
        # 메인 프레임
        main_frame = ctk.CTkFrame(self.root)
        main_frame.pack(fill="both", expand=True, padx=20, pady=20)
        
        # 제목
        title_label = ctk.CTkLabel(main_frame, text="엑셀 시트 자동 병합기", 
                                  font=ctk.CTkFont(size=20, weight="bold"))
        title_label.pack(pady=(0, 20))
        
        # 폴더 선택 섹션
        folder_frame = ctk.CTkFrame(main_frame)
        folder_frame.pack(fill="x", pady=10)
        
        # 감시 폴더 선택
        watch_label = ctk.CTkLabel(folder_frame, text="감시 폴더:")
        watch_label.pack(anchor="w", padx=10, pady=(10, 5))
        
        watch_frame = ctk.CTkFrame(folder_frame)
        watch_frame.pack(fill="x", padx=10, pady=(0, 10))
        
        self.watch_entry = ctk.CTkEntry(watch_frame, placeholder_text="엑셀 파일이 있는 폴더 선택")
        self.watch_entry.pack(side="left", fill="x", expand=True, padx=(10, 5))
        
        watch_button = ctk.CTkButton(watch_frame, text="폴더 선택", 
                                    command=self.select_watch_folder, width=100)
        watch_button.pack(side="right", padx=(5, 10))
        
        # 출력 폴더 선택
        output_label = ctk.CTkLabel(folder_frame, text="출력 폴더:")
        output_label.pack(anchor="w", padx=10, pady=(10, 5))
        
        output_frame = ctk.CTkFrame(folder_frame)
        output_frame.pack(fill="x", padx=10, pady=(0, 10))
        
        self.output_entry = ctk.CTkEntry(output_frame, placeholder_text="병합된 파일 저장 폴더 선택")
        self.output_entry.pack(side="left", fill="x", expand=True, padx=(10, 5))
        
        output_button = ctk.CTkButton(output_frame, text="폴더 선택", 
                                     command=self.select_output_folder, width=100)
        output_button.pack(side="right", padx=(5, 10))
        
        # 제어 버튼 섹션
        control_frame = ctk.CTkFrame(main_frame)
        control_frame.pack(fill="x", pady=20)
        
        self.scan_button = ctk.CTkButton(control_frame, text="파일 스캔", 
                                         command=self.scan_files, height=40)
        self.scan_button.pack(fill="x", padx=10, pady=10)
        
        button_frame = ctk.CTkFrame(control_frame)
        button_frame.pack(fill="x", padx=10, pady=(0, 10))
        
        self.merge_button = ctk.CTkButton(button_frame, text="병합 실행", 
                                          command=self.start_merge, height=40, 
                                          state="disabled")
        self.merge_button.pack(side="left", fill="x", expand=True, padx=(0, 5))
        
        self.auto_button = ctk.CTkButton(button_frame, text="자동 모드", 
                                         command=self.toggle_auto_mode, height=40)
        self.auto_button.pack(side="right", fill="x", expand=True, padx=(5, 0))
        
        # 진행 상태바
        self.progress_bar = ctk.CTkProgressBar(main_frame)
        self.progress_bar.pack(fill="x", padx=20, pady=(10, 5))
        self.progress_bar.set(0)
        
        # 상태 텍스트
        self.status_label = ctk.CTkLabel(main_frame, text="준비됨", text_color="gray")
        self.status_label.pack(pady=5)
        
        # 결과 표시 영역
        result_frame = ctk.CTkFrame(main_frame)
        result_frame.pack(fill="both", expand=True, pady=10)
        
        result_label = ctk.CTkLabel(result_frame, text="파일 그룹 현황", 
                                   font=ctk.CTkFont(size=14, weight="bold"))
        result_label.pack(anchor="w", padx=10, pady=(10, 5))
        
        # 트리뷰 스타일 설정
        style = ttk.Style()
        style.theme_use("clam")
        
        self.result_tree = ttk.Treeview(result_frame, columns=("count",), show="tree headings")
        self.result_tree.heading("#0", text="파일 그룹")
        self.result_tree.heading("count", text="파일 수")
        self.result_tree.column("#0", width=300)
        self.result_tree.column("count", width=100)
        
        tree_scroll = ctk.CTkScrollbar(result_frame, command=self.result_tree.yview)
        self.result_tree.configure(yscrollcommand=tree_scroll.set)
        
        self.result_tree.pack(side="left", fill="both", expand=True, padx=(10, 0), pady=(0, 10))
        tree_scroll.pack(side="right", fill="y", padx=(0, 10), pady=(0, 10))
        
    def select_watch_folder(self):
        folder = filedialog.askdirectory(title="감시할 폴더 선택")
        if folder:
            self.watch_folder = folder
            self.watch_entry.delete(0, "end")
            self.watch_entry.insert(0, folder)
            
    def select_output_folder(self):
        folder = filedialog.askdirectory(title="출력 폴더 선택")
        if folder:
            self.output_folder = folder
            self.output_entry.delete(0, "end")
            self.output_entry.insert(0, folder)
            
    def scan_files(self):
        if not self.watch_folder:
            messagebox.showwarning("경고", "감시 폴더를 먼저 선택하세요.")
            return
            
        self.status_label.configure(text="파일 스캔 중...")
        self.progress_bar.set(0.3)
        self.root.update()
        
        try:
            self.merger = ExcelMerger(self.watch_folder, self.output_folder or os.path.join(self.watch_folder, "output"))
            summary = self.merger.get_file_summary()
            
            # 트리뷰 초기화
            for item in self.result_tree.get_children():
                self.result_tree.delete(item)
                
            # 결과 표시
            for prefix, count in summary.items():
                self.result_tree.insert("", "end", text=prefix, values=(count,))
                
            self.status_label.configure(text=f"스캔 완료 - {len(summary)}개 그룹 발견")
            self.progress_bar.set(1.0)
            
            if summary:
                self.merge_button.configure(state="normal")
            else:
                messagebox.showinfo("정보", "처리할 파일 그룹이 없습니다.")
                
        except Exception as e:
            messagebox.showerror("오류", f"파일 스캔 중 오류 발생: {str(e)}")
            self.status_label.configure(text="스캔 실패")
            self.progress_bar.set(0)
            
    def start_merge(self):
        if not self.merger:
            messagebox.showwarning("경고", "먼저 파일을 스캔하세요.")
            return
            
        if self.auto_mode:
            messagebox.showinfo("정보", "자동 모드에서는 수동 병합이 필요 없습니다.")
            return
            
        self.merge_button.configure(state="disabled")
        self.scan_button.configure(state="disabled")
        self.status_label.configure(text="병합 중...")
        self.progress_bar.set(0.5)
        self.root.update()
        
        # 병합 작업을 별도 스레드에서 실행
        thread = threading.Thread(target=self.merge_files)
        thread.daemon = True
        thread.start()
        
    def merge_files(self):
        try:
            self.merger.process_all_groups()
            
            self.root.after(0, self.merge_complete)
            
        except Exception as e:
            self.root.after(0, lambda: self.merge_error(str(e)))
            
    def merge_complete(self):
        self.status_label.configure(text="병합 완료!")
        self.progress_bar.set(1.0)
        self.merge_button.configure(state="normal")
        self.scan_button.configure(state="normal")
        
        messagebox.showinfo("완료", "엑셀 파일 병합이 완료되었습니다.")
        
    def merge_error(self, error_msg):
        self.status_label.configure(text="병합 실패")
        self.progress_bar.set(0)
        self.merge_button.configure(state="normal")
        self.scan_button.configure(state="normal")
        
        messagebox.showerror("오류", f"병합 중 오류 발생: {error_msg}")
        
    def toggle_auto_mode(self):
        """자동 모드 토글"""
        if not self.auto_mode:
            if not self.watch_folder:
                messagebox.showwarning("경고", "감시 폴더를 먼저 선택하세요.")
                return
                
            if not self.output_folder:
                messagebox.showwarning("경고", "출력 폴더를 먼저 선택하세요.")
                return
                
            self.start_auto_mode()
        else:
            self.stop_auto_mode()
            
    def start_auto_mode(self):
        """자동 모드 시작"""
        try:
            self.auto_merger = AutoMerger(self.watch_folder, self.output_folder, self.auto_callback)
            self.auto_merger.start_watching()
            
            self.auto_mode = True
            self.auto_button.configure(text="자동 모드 중지", fg_color="red")
            self.status_label.configure(text="자동 감시 모드 실행 중", text_color="green")
            
            messagebox.showinfo("시작", "자동 감시 모드가 시작되었습니다.\n새 파일이 추가되면 자동으로 병합됩니다.")
            
        except Exception as e:
            messagebox.showerror("오류", f"자동 모드 시작 실패: {str(e)}")
            
    def stop_auto_mode(self):
        """자동 모드 중지"""
        if self.auto_merger:
            self.auto_merger.stop_watching()
            self.auto_merger = None
            
        self.auto_mode = False
        self.auto_button.configure(text="자동 모드", fg_color=None)
        self.status_label.configure(text="자동 감시 모드 중지됨", text_color="gray")
        
    def auto_callback(self, event_type, data=None):
        """자동 병합 콜백"""
        if event_type == "auto_merge_complete":
            self.root.after(0, self.auto_merge_complete)
        elif event_type == "auto_merge_error":
            self.root.after(0, lambda: self.auto_merge_error(data))
            
    def auto_merge_complete(self):
        """자동 병합 완료"""
        current_time = time.strftime("%H:%M:%S")
        self.status_label.configure(text=f"자동 병합 완료 ({current_time})", text_color="green")
        
        # 3초 후 원래 상태로 복귀
        self.root.after(3000, lambda: self.status_label.configure(
            text="자동 감시 모드 실행 중", text_color="green"))
            
    def auto_merge_error(self, error_msg):
        """자동 병합 오류"""
        self.status_label.configure(text="자동 병합 실패", text_color="red")
        
    def on_closing(self):
        """프로그램 종료 시 처리"""
        if self.auto_mode:
            self.stop_auto_mode()
        self.root.destroy()
        
    def run(self):
        self.root.protocol("WM_DELETE_WINDOW", self.on_closing)
        self.root.mainloop()

if __name__ == "__main__":
    app = ExcelMergerGUI()
    app.run()