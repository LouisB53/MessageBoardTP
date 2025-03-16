{ pkgs }: {
	deps = [
   pkgs.nano
		pkgs.nodejs-12_x
		pkgs.nodePackages.vscode-langservers-extracted
		pkgs.nodePackages.typescript-language-server
		pkgs.yarn
		pkgs.replitPackages.jest
	];
}

