import I18n from 'react-native-i18n';

/**
 * Creates error alerts
 * @param err
 * @author preyv
 */
const createErrorAlert = function (err) {
    return createAlert(I18n.t('Error'),err);
};

/**
 * Creates generic popup to avoid using 'showPopupAlert' in each screen
 * @param title
 * @param text
 * @param options
 * @param content
 * @author preyv
 * @returns {{refresh: *, outside: boolean, title: *, height: number, animation: number, contentText: *, content: *, options: {1: {key: string, text: *, align: string}}}}
 */
const createAlert = function (title, text, options, content) {
    let height = 200 + (options?Object.keys(options).length*50:100);
    let messageAlert = {
        refresh: new Date().valueOf(),
        outside: false,
        title: title,
        height: height,
        animation: 2,
        contentText: text,
        content: content,
        options: options ? options : {
            1: {
                key: 'button1',
                text: I18n.t('accept'),
                align: ''
            }
        }
    };
    return messageAlert;
};
export {createErrorAlert,createAlert};
