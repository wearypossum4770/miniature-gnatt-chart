#!/bin/bash

touch ~/.bashrc ~/.profile ~/.zshrc  && chmod +x ~/.bashrc ~/.profile ~/.zshrc  && apt-get update && apt-get install -y openssl sqlite3 curl --no-install-recommends && export NVM_COLORS='cmgRY' && curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash && export NVM_DIR=$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm") \n[ -s "${XDG_CONFIG_HOME}/bash_completion" ] && \. "${XDG_CONFIG_HOME}/bash_completion" \n[ -s "${XDG_CONFIG_HOME}/nvm.sh" ] && bash -c "source  ~/.bashrc" && nvm install node && apt-get clean && rm -rf /var/lib/apt/lists/* 


apt-get update && apt-get install -y openssl sqlite3 --no-install-recommends && apt-get clean && rm -rf /var/lib/apt/lists/*
