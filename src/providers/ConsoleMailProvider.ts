import { injectable } from 'inversify';
import { IMailProvider, Mail } from './IMailProvider';

// Modo test: não envia nada pela rede, só imprime o e-mail no console.
@injectable()
export class ConsoleMailProvider implements IMailProvider {
  async sendMail(mail: Mail): Promise<string | null> {
    console.log('----- E-mail (modo test) -----');
    console.log(`Para: ${mail.to}`);
    console.log(`Assunto: ${mail.subject}`);
    console.log(mail.text);
    console.log('------------------------------');
    return null;
  }
}
