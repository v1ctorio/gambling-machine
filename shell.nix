let
  nixpkgs = import <nixpkgs>{} ;
in
  with nixpkgs;
  stdenv.mkDerivation {
    name = "rust";
    buildInputs = [ openssl rustup rust-analyzer cmake zlib ];

    shellHook = ''
        export OPENSSL_DIR="${openssl.dev}"
        export OPENSSL_LIB_DIR="${openssl.out}/lib"
    '';
  }
