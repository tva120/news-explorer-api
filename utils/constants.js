const notFoundErrorText = 'Запрашиваемый ресурс не найден';
const badRequestErrorText = 'Невозможно выполнить операцию';
const authErrorText = 'Необходима авторизация';
const existErrorText = (email) => `Пользователь с email ${email} уже существует!`;
const internalErrorText = 'На сервере произошла ошибка';
const rightsErrorText = 'Недостаточно прав';
const successText = {message:'Успешно!'};

module.exports = {
  notFoundErrorText,
  badRequestErrorText,
  authErrorText,
  existErrorText,
  internalErrorText,
  rightsErrorText,
  successText,
};
