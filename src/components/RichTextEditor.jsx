import React, { useRef, useMemo, useCallback } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import './RichTextEditor.css';
import { supabase } from '../lib/supabase';

const BUCKET = 'job-images';

function RichTextEditor({ value, onChange, placeholder }) {
  const quillRef = useRef(null);

  // 이미지: 파일 선택 → Supabase 스토리지 업로드 → 공개 URL 삽입(base64 방지)
  const imageHandler = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async () => {
      const file = input.files && input.files[0];
      if (!file) return;
      const ext = (file.name.split('.').pop() || 'png').toLowerCase();
      const path = `posts/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from(BUCKET).upload(path, file, { upsert: false });
      if (error) { alert(`이미지 업로드 오류: ${error.message}`); return; }
      const url = supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
      const editor = quillRef.current && quillRef.current.getEditor();
      if (!editor) return;
      const range = editor.getSelection(true) || { index: editor.getLength() };
      editor.insertEmbed(range.index, 'image', url, 'user');
      editor.setSelection(range.index + 1, 0);
    };
    input.click();
  }, []);

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['blockquote', 'code-block'],
          ['link', 'image', 'video'],
          ['clean'],
        ],
        handlers: { image: imageHandler },
      },
    }),
    [imageHandler],
  );

  return (
    <div className="rte">
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value || ''}
        onChange={onChange}
        modules={modules}
        placeholder={placeholder}
      />
    </div>
  );
}

export default RichTextEditor;
