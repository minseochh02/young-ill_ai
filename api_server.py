# -*- coding: utf-8 -*-
"""
대시보드용 API 서버 (독립 실행용)
--watch 모드에서는 자동 통합되므로 별도 실행 불필요.
단독으로 API 서버만 필요할 때 사용:
  python api_server.py
"""

from parse_basic_sheets import start_api_server

if __name__ == '__main__':
    server = start_api_server()
    print("종료: Ctrl+C")
    try:
        import time
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        server.shutdown()
        print("\nAPI 서버 종료.")
