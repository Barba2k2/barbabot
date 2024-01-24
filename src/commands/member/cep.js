const { PREFIX } = require("../../config");
const { consultarCep } = require("correios-brasil");

module.exports = {
  name: "cep",
  description: "CEP appointment",
  commands: ["cep"],
  usage: `${PREFIX}cep 01001-001`,
  handle: async ({ args, sendWarningReply, sendSuccessReply }) => {
    const cepSearch = args[0];

    if (!cepSearch || ![8, 9].includes(cepSearch.length)) {
      return sendWarningReply(
        "Do you need to send the CEP on format 00000-000 ou 00000000!"
      );
    }

    try {
      const data = await consultarCep(cepSearch);

      if (!data.cep) {
        await sendWarningReply("CEP not found!");
        return;
      }

      const { cep, logradouro, complemento, bairro, localidade, uf } = data;

      await sendSuccessReply(`*Result:*
      
      *CEP:* ${cep}
      *Logradouro:* ${logradouro}
      *Complemento:* ${complemento}
      *Bairro:* ${bairro}
      *Cidade:* ${localidade}
      *UF:* ${uf}
      `);
    } catch (error) {
      console.log(`CEP consulting error: ${error}`);
      throw new Error("Error on consult CEP");
    }
  },
};
