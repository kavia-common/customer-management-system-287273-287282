#!/bin/bash
cd /home/kavia/workspace/code-generation/customer-management-system-287273-287282/react_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

