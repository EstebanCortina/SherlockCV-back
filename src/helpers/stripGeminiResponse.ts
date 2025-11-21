  export default (str: string) => {
    const start = '```json';
    const end = '```';

    if (str.startsWith(start) && str.endsWith(end)) {
      return str.slice(start.length, str.length - end.length).trim();
    }

    return str;
}