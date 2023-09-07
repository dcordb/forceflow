import * as fs from "node:fs";

class LanguageMapper {
  mapper;

  constructor() {
    this.mapper = new Map();
  }

  getLangConfig(extension) {
    const extVals = this.mapper.get(extension);
    const alias = extVals.default;
    const result = extVals.langConfigs.find((x) => x.alias === alias);
    return result;
  }

  addLangConfig(extension, langConfig) {
    if (!this.mapper.has(extension))
      this.mapper.set(extension, new LanguageConfigCollection());

    const collection = this.mapper.get(extension);
    collection.addLang(langConfig);
  }

  dumps(configFile) {
    const obj = Object.fromEntries(this.mapper);
    fs.writeFileSync(configFile, JSON.stringify(obj, null, 4));
  }

  loads(configFile) {
    let result = fs.readFileSync(configFile, { encoding: "utf8" });
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
  compiler;
  runner;

  constructor(alias, description, extension, langId, compiler, runner) {
    this.alias = alias;
    this.description = description;
    this.extension = extension;
    this.langId = langId;
    this.compiler = compiler;
    this.runner = runner;
  }
}

export { LanguageMapper, LanguageConfig };
