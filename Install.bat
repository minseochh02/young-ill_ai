@echo off
chcp 65001 > nul
echo ============================================
echo   영일오엔씨 일보현황 대시보드 설치
echo ============================================
echo.

REM Node.js 확인
where node > nul 2>&1
if %errorlevel% neq 0 (
    echo [오류] Node.js가 설치되어 있지 않습니다.
    echo https://nodejs.org 에서 Node.js를 설치해주세요.
    pause
    exit /b 1
)

echo [1/3] Node.js 버전 확인...
node --version
echo.

echo [2/3] 대시보드 패키지 설치 중...
cd /d "%~dp0daily-report-dashboard"
call npm install
echo.

echo [3/3] Python 패키지 확인...
cd /d "%~dp0"
pip install pandas openpyxl python-calamine watchdog --quiet 2>nul
if %errorlevel% equ 0 (
    echo Python 패키지 설치 완료
) else (
    echo [참고] Python 패키지 설치 실패 - 데이터 파이프라인 사용 시 수동 설치 필요
)
echo.

echo ============================================
echo   설치 완료!
echo   START.BAT 를 실행하여 대시보드를 시작하세요.
echo ============================================
pause
