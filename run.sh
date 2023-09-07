#!/bin/bash
NODE_NO_WARNINGS=1 node --loader=$FORCEFLOW/node_modules/import-jsx/index.js $FORCEFLOW/src/app.js "$@"
