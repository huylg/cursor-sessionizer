# VS Code Sessionizer

## Demo

![Demo](demo.gif)

## Link

https://marketplace.visualstudio.com/items?itemName=omercohen.vscode-sessionizer

## Overview

Easily open directories in specified roots by fuzzy finding them.

Based on the notion that fuzzy finding is the fastest and most efficient way to selecting items.

## How To Use

first, specify the `sessionizer.sessionRoots` setting, which is an array of the root directories of project directories, for example: ["\~/Desktop/projects", "\~/Desktop/work"]

Then, open the command palette (cmd+shift+p) and run any one of the following commands:

- `Sessionizer: Open` (Will open the directory using the `code` command)

You will be prompted to select a directory from any one of the roots specified.

It is recommended to [create a keybinding](https://code.visualstudio.com/docs/getstarted/keybindings) (for example, cmd+shift+s) to the command.