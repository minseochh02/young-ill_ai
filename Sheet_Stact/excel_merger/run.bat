@echo off
echo 엑셀 시트 자동 병합기 시작 중...
echo.

REM 가상환경 확인 및 생성
if not exist venv (
    echo 가상환경 생성 중...
    python -m venv venv
)

REM 가상환경 활성화
echo 가상환경 활성화 중...
call venv\Scripts\activate.bat

REM 패키지 설치
echo 필요 패키지 설치 중...
pip install -r requirements.txt

REM 애플리케이션 실행
echo 애플리케이션 시작...
python main.py

pause