import { ContentState } from 'draft-js';
import htmlToDraft from 'html-to-draftjs';

export default function plainText(content) {
  if (content) {
    const contentBlock = htmlToDraft(content);
    const contentState = ContentState.createFromBlockArray(
      contentBlock.contentBlocks
    );
    return contentState.getPlainText();
  }
  return '';
}
