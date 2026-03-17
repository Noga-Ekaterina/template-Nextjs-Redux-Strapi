import parse from "html-react-parser";

export const nonBreakingSpaces=(str: string|null|undefined)=>{
  return str&& parse(str.replaceAll("^", "&nbsp;"))
}