@echo off
chcp 65001 > nul
echo ============================================
echo   영일오엔씨 일보현황 대시보드 시작
echo ============================================
echo.

cd /d "%~dp0daily-report-dashboard"

echo 대시보드 서버를 시작합니다...
echo.
echo 브라우저에서 자동으로 열립니다.
echo 종료하려면 이 창을 닫으세요.
echo.
echo ============================================

REM --watch 모드 실행 (API 서버 + 폴더 감시)
cd /d "%~dp0"
start "BasicSheet Watch" cmd /c "python parse_basic_sheets.py --watch"

REM 3초 후 브라우저 열기 (서버 시작 대기)
cd /d "%~dp0daily-report-dashboard"
start /b cmd /c "timeout /t 3 /nobreak > nul && start http://localhost:5173"

REM 대시보드 서버 실행
npm run dev
