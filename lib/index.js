var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __export = (target, all) => {
  for (var name2 in all)
    __defProp(target, name2, { get: all[name2], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  Config: () => Config,
  apply: () => apply,
  name: () => name
});
module.exports = __toCommonJS(src_exports);
var import_koishi2 = require("koishi");

// src/commands/petpet.ts
var import_koishi = require("koishi");

// src/tools/getAvaImage.ts
var import_axios = __toESM(require("axios"));
async function urlToBuffer(url) {
  const response = await import_axios.default.get(url, {
    responseType: "arraybuffer"
    // 指定响应类型为二进制数据
  });
  return Buffer.from(response.data, "binary");
}
__name(urlToBuffer, "urlToBuffer");
var getAvaImage_default = urlToBuffer;

// src/commands/petpet.ts
var import_koishi_plugin_memelib = require("@quanhuzeyu/koishi-plugin-memelib");
async function petpet(session, message) {
  const s = session.session;
  if (typeof message === "string") {
    const id = message.match(/id="(.*)"/);
    const img = message.match(/src="(.*)"/);
    if (id != void 0) {
      const atUserAvaUrl = `http://thirdqq.qlogo.cn/headimg_dl?dst_uin=${id[1]}&spec=640`;
      const pet = await urlToPet(atUserAvaUrl);
      if (typeof pet === "object") {
        s.send(pet);
      } else {
        s.send(pet + "；无法获取at对象的头像");
      }
    } else if (img != void 0) {
      const pet = await urlToPet(img[1]);
      if (typeof pet === "object") {
        s.send(pet);
      } else {
        s.send(pet + `；图片参数制作时出现问题    ${typeof pet}`);
      }
    }
  } else if (typeof message === "number") {
    defaultPetpet(session);
  } else {
    defaultPetpet(session);
  }
}
__name(petpet, "petpet");
async function defaultPetpet(argV, message = void 0) {
  const s = argV.session;
  const userAvatarUrl = s.event.user.avatar;
  const pet = await urlToPet(userAvatarUrl);
  if (typeof pet === "object") {
    s.send(pet);
  } else {
    s.send(pet + "；生成图像时发生错误");
  }
}
__name(defaultPetpet, "defaultPetpet");
async function urlToPet(url) {
  const buf = await getAvaImage_default(url);
  const _b = import_koishi_plugin_memelib.MemeGenerator.tools.imageTools.isGif(buf);
  if (_b === false) {
    try {
      const cir = await import_koishi_plugin_memelib.MemeGenerator.tools.imageTools.cropToCircle(buf);
      const pet = await import_koishi_plugin_memelib.MemeGenerator.Petpet(cir);
      if (pet instanceof Buffer) {
        return import_koishi.h.image(pet, "image/gif");
      } else {
        return "制作头像时出现错误";
      }
    } catch (err) {
      console.log(err);
      throw err;
    }
  } else if (_b === true) {
    const pet = await import_koishi_plugin_memelib.MemeGenerator.Petpet(buf, true);
    if (pet instanceof Buffer) {
      return import_koishi.h.image(pet, "image/gif");
    } else {
      return "制作头像时出现错误";
    }
  }
}
__name(urlToPet, "urlToPet");
var petpet_default = petpet;

// src/commands/index.ts
var commands = { petpet: petpet_default };
var commands_default = commands;

// src/index.ts
var name = "模因";
var Config = import_koishi2.Schema.object({});
function apply(ctx) {
  ctx.command("petpet [arg]").alias("摸").action((_, mes) => {
    commands_default.petpet(_, mes);
  });
}
__name(apply, "apply");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Config,
  apply,
  name
});
