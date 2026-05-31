.PHONY: install compile package clean

install:
	sudo npm install -g @vscode/vsce
	npm install

compile:
	npm run compile

package:
	vsce package --allow-missing-repository

clean:
	rm -rf out
	rm -f *.vsix
run:
	codium --install-extension micronaut-launch-vscode-0.0.1.vsix
rebuild: clean install compile