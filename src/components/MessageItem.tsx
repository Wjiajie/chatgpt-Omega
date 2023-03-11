import type { Accessor } from 'solid-js';
import type { ChatMessage } from '../types';
import MarkdownIt from 'markdown-it';
// @ts-ignore
import mdKatex from 'markdown-it-katex';
import mdHighlight from 'markdown-it-highlightjs';
import IconCopyCode from './icons/CopyCode'
import IconCopyText from './icons/CopyText'

interface Props {
  role: ChatMessage['role'];
  message: Accessor<string> | string;
}

export default ({ role, message }: Props) => {
  const roleClass = {
    system: 'bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300',
    user: 'bg-gradient-to-r from-purple-400 to-yellow-400',
    assistant: 'bg-gradient-to-r from-yellow-200 via-green-200 to-green-300',
  };

  const htmlString = () => {
    const md = MarkdownIt().use(mdKatex).use(mdHighlight);

    if (typeof message === 'function') {
      return md.render(message());
    } else if (typeof message === 'string') {
      return md.render(message);
    }

    return '';
  };

  const handleCopyCode = (e: MouseEvent<HTMLButtonElement>) => {
    // 获取代码块的文本内容
    const codeBlock = e.currentTarget.parentNode.querySelector('.hljs');
    const codeText = codeBlock ? codeBlock.textContent : '';

    navigator.clipboard.writeText(codeText);
    const tooltip = document.createElement('span');
    tooltip.textContent = 'code Copied!';
    tooltip.classList.add('text-green-500', 'text-xs', 'absolute', 'transform', 'translate-y-full');
    const buttonRect = e.currentTarget.getBoundingClientRect();
    tooltip.style.top = `${buttonRect.top}px`;
    tooltip.style.right = `${window.innerWidth - buttonRect.right}px`;
    document.body.appendChild(tooltip);
    setTimeout(() => {
      tooltip.remove();
    }, 1000);
  };

  const handleCopyText = (e: MouseEvent<HTMLButtonElement>) => {
    navigator.clipboard.writeText(typeof message === 'function' ? message() : message);
    const tooltip = document.createElement('span');
    tooltip.textContent = 'text Copied!';
    tooltip.classList.add('text-green-500', 'text-xs', 'absolute', 'transform', 'translate-y-full');
    const buttonRect = e.currentTarget.getBoundingClientRect();
    tooltip.style.top = `${buttonRect.top}px`;
    tooltip.style.right = `${window.innerWidth - buttonRect.right}px`;
    document.body.appendChild(tooltip);
    setTimeout(() => {
      tooltip.remove();
    }, 1000);
  };

  return (
    <div class="flex py-2 gap-3 -mx-4 px-4 rounded-lg transition-colors md:hover:bg-slate/3 relative">
      <div class={`shrink-0 w-7 h-7 mt-4 rounded-full op-80 ${roleClass[role]}`} />
      <div class="message prose text-slate break-words overflow-hidden" innerHTML={htmlString()} />
      <button class="text-gray-400 hover:text-gray-600 absolute top-0 right-0 mr-2 mt-2" onClick={handleCopyText} title="Copy Text">
      <IconCopyText/>
      </button>
      <button class="text-gray-400 hover:text-gray-600 absolute top-0 right-10 mr-2 mt-2" onClick={handleCopyCode} title="Copy Code">
      <IconCopyCode/>
      </button>
    </div>
  );
};