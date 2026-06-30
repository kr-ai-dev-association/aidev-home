import React from 'react';
import MDEditor from '@uiw/react-md-editor';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import './MarkdownField.css';
import { useI18n } from '../i18n/I18nProvider';

// 마크다운 에디터 (입력) — 넓고 길게
export function MarkdownEditor({ value, onChange, height = 420, placeholder }) {
  const { t } = useI18n(); // eslint-disable-line no-unused-vars
  return (
    <div data-color-mode="dark" className="md-editor-wrap">
      <MDEditor
        value={value || ''}
        onChange={(v) => onChange(v || '')}
        height={height}
        preview="live"
        textareaProps={{ placeholder }}
      />
    </div>
  );
}

// 마크다운 리더 (출력)
export function MarkdownView({ source }) {
  if (!source) return null;
  return (
    <div data-color-mode="dark" className="md-view">
      <MDEditor.Markdown source={source} />
    </div>
  );
}
