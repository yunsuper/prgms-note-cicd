#!/bin/sh
set -e

# build 폴더가 위치한 곳으로 확실히 이동
cd /var/app/build

echo "Generating env.js..."

# env.js 초기화 및 작성 (sh 환경에서도 돌아가는 방식)
echo "window._ENV = {" > env.js
env | grep '^REACT_APP_' | while IFS='=' read -r key value; do
    echo "  $key: '$value'," >> env.js
done
echo "};" >> env.js

echo "Generated env.js content:"
cat env.js

# serve 명령어로 서비스 시작 (-s . 은 현재 폴더(build)를 서빙한다는 뜻)
echo "Starting serve..."
exec serve -s . -l 3000