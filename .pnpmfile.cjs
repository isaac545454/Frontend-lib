/**
 * O repo do DS não versiona `dist`, e `files` publica só essa pasta.
 * O postinstall da raiz baixa o source e gera `dist` dentro do pacote instalado.
 */
function readPackage(pkg) {
  if (pkg.name === "@isaac545454/nucleus") {
    delete pkg.files;
  }

  return pkg;
}

module.exports = {
  hooks: {
    readPackage,
  },
};
