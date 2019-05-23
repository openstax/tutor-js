export default function mockedCreateRange() {
  return jest.fn(() => ({
    setStart: () => {},
    setEnd: () => {},
    collapse: jest.fn(),
    commonAncestorContainer: {
      nodeName: 'BODY',
      ownerDocument: document,
    },
  }));
}
