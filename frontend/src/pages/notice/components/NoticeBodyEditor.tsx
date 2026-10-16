import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Image as ImageIcon } from 'lucide-react';
import type { useNoticeEditor } from '../hooks/useNoticeEditor';

type NoticeBodyEditorProps = Pick<
  ReturnType<typeof useNoticeEditor>,
  'uploadingImage' | 'handleImageUpload' | 'contentRef' | 'formData' | 'setFormData'
>;

export function NoticeBodyEditor({
  uploadingImage,
  handleImageUpload,
  contentRef,
  formData,
  setFormData,
}: NoticeBodyEditorProps) {
  return (
    <>
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label htmlFor="content" className="text-[#2C2C2C] font-semibold text-base">
            내용 *
          </Label>
          <div className="flex gap-2">
            <label className="cursor-pointer px-4 py-2 text-sm bg-[#2C2C2C] text-[#F4F4F0] rounded-lg hover:bg-[#2C2C2C]/90 transition-colors flex items-center">
              <ImageIcon className="w-4 h-4 mr-2" />
              {uploadingImage ? '업로드 중...' : '이미지 삽입'}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploadingImage}
                className="hidden"
              />
            </label>
          </div>
        </div>
        <Textarea
          ref={contentRef}
          id="content"
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          placeholder="내용을 입력해주세요. 이미지는 '이미지 삽입' 버튼을 사용하세요."
          className="w-full px-4 py-3 border border-[#2C2C2C]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C84630] focus:border-[#C84630] bg-white text-[#2C2C2C] resize-none"
          rows={15}
          required
        />
        <p className="text-xs text-[#2C2C2C]/50 mt-2">
          💡 이미지는 Markdown 형식으로 삽입됩니다. 예: ![이미지설명](URL)
        </p>
      </div>
    </>
  );
}
