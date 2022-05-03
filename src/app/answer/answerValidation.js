import * as yup from 'yup';
import FieldMessage from '../../utils/exceptions/fieldmessage';

import CompanyRepository from '../company/companyRepository';

const updateAnswersSchema = yup.object().shape({
  responses: yup
    .array(
      yup.object().shape({
        answer: yup
          .string()
          .oneOf(['Sim', 'Não', 'Talvez'])
          .required('Campo Obrigatório'),
        questionId: yup
          .number()
          .integer()
          .required('Campo Obrigatório'),
      })
    )
    .required('Campo Obrigatório'),
});

class AnswerValidation {
  constructor({ userRepository }) {
    this.userRepository = userRepository;
    this.companyRepository = new CompanyRepository();
  }

  async updateAnswers(req) {
    const errors = [];

    const { body, params } = req;

    try {
      await updateAnswersSchema.validate(body, { abortEarly: false });
    } catch (err) {
      console.log(err);
      err.inner.forEach(error => {
        errors.push(new FieldMessage(error.path, error.message));
      });

      return errors;
    }

    const foundCompany = await this.companyRepository.findById(
      params.companyId
    );

    if (!foundCompany) {
      errors.push(
        new FieldMessage('params.companyId', 'Não existe empresa com esse id')
      );
    }

    // Validar se o user eh realmente daquela empresa ou nao... pegar o company id do token que vai ser feito

    return errors;
  }
}

export default AnswerValidation;
