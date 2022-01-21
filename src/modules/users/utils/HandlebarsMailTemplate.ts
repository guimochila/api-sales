import fs from 'fs'
import handlebars from 'handlebars'

interface ITemplateVariable {
  [key: string]: string | number
}

export interface IParseMailTemplate {
  file: string
  variables: ITemplateVariable
}

class HandlebarsMailTemplate {
  public async parse({ file, variables }: IParseMailTemplate): Promise<string> {
    const templateFileContent = await fs.promises.readFile(file, {
      encoding: 'utf-8',
    })
    const parseTemplate = handlebars.compile(templateFileContent)

    return parseTemplate(variables)
  }
}

export default HandlebarsMailTemplate
