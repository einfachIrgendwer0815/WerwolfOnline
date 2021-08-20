#!/bin/bash

authbind --deep /usr/bin/gunicorn3 --workers=5 -b localhost:80 werwolfOnlineBackendServer:app