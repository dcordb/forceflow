#!/bin/bash
NODE_NO_WARNINGS=1 node --loader=import-jsx ./src/app.js "$@"
