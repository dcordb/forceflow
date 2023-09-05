import * as fs from "node:fs/promises";

class LanguageMapper {
  mapper;

  constructor() {
    this.mapper = new Map();
  }

  getLangConfig(extension) {
    return this.mapper[extension].default;
  }

  addLangConfig(extension, langConfig) {
    if (!this.mapper.has(extension))
      this.mapper.set(extension, new LanguageConfigCollection());

    const collection = this.mapper.get(extension);
    collection.addLang(langConfig);
  }

  async dumps(configFile) {
    const obj = Object.fromEntries(this.mapper);
    await fs.writeFile(configFile, JSON.stringify(obj, null, 4));
  }

  async loads(configFile) {
    let result = await fs.readFile(configFile, { encoding: "utf8" });
    result = new Map(Object.entries(JSON.parse(result)));
    this.mapper = result;
  }
}

class LanguageConfigCollection {
  langConfigs = [];
  default = null;

  addLang(langConfig) {
    this.langConfigs.push(langConfig);
    this.default = langConfig.alias;
  }
}

class LanguageConfig {
  alias;
  description;
  extension;
  langId;

  constructor(alias, description, extension, langId) {
    this.alias = alias;
    this.description = description;
    this.extension = extension;
    this.langId = langId;
  }
}

export { LanguageMapper, LanguageConfig };
