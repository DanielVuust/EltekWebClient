import { FileSizePipe } from './file-size.pipe';

describe('FileSizePipe', () => {
  it('create an instance', () => {
    const pipe = new FileSizePipe();
    expect(pipe).toBeTruthy();
  });
  it('should convert bytes to megabytes', () => {
    const pipe = new FileSizePipe();
    expect(pipe.transform(1024)).toBe('1 KB');
  });
  it('should use the default unit', () => {
    const pipe = new FileSizePipe();
    expect(pipe.transform(0)).toBe('0 Bytes');
  });
});
