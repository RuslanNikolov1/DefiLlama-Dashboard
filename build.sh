#!/bin/bash
npm ci
npm run build
echo "Build completed. Contents of dist directory:"
ls -la dist/
echo "Build script finished successfully"
