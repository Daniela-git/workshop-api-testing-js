deleteData = {
  query: {
    description: 'gist to try delete method',
    public: true,
    files: {
      'promise.js': {
        content: `const aplicarDescuento = new Promise(function (resolve, reject) {    
          const descuento = false;   
          if (descuento) {       
           resolve("descuento aplicado");    
          } else {
            reject("no se puede aplicar");
          }});`,
      },
    },
  },
};

module.exports = deleteData;
