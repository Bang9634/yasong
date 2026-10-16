import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { useUpdateLogEditor } from '../hooks/useUpdateLogEditor';

type UpdateLogFormProps = Pick<
  ReturnType<typeof useUpdateLogEditor>,
  'handleSubmit' | 'formData' | 'setFormData' | 'handleCancel' | 'isSubmitting'
> & {
  isEdit: boolean;
};

export function UpdateLogForm({
  handleSubmit,
  formData,
  setFormData,
  handleCancel,
  isSubmitting,
  isEdit,
}: UpdateLogFormProps) {
  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          {/* 제목 */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-base font-medium">
              제목 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="업데이트 제목을 입력하세요"
              className="w-full px-4 py-3 border border-[#2C2C2C]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C84630] focus:border-[#C84630] bg-white text-[#2C2C2C]"
              required
            />
          </div>

          {/* 버전 및 날짜 */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="version" className="text-base font-medium">
                버전 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="version"
                value={formData.version}
                onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                placeholder="예: 1.0.0"
                className="w-full px-4 py-3 border border-[#2C2C2C]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C84630] focus:border-[#C84630] bg-white text-[#2C2C2C]"
                required
              />
              <p className="text-sm text-[#2C2C2C]/60">버전 형식: 1.0.0 또는 2024.01.01</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="updateDate" className="text-base font-medium">
                업데이트 날짜 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="updateDate"
                type="date"
                value={formData.updateDate}
                onChange={(e) => setFormData({ ...formData, updateDate: e.target.value })}
                className="w-full px-4 py-3 border border-[#2C2C2C]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C84630] focus:border-[#C84630] bg-white text-[#2C2C2C]"
                required
              />
            </div>
          </div>

          {/* 내용 */}
          <div className="space-y-2">
            <Label htmlFor="content" className="text-base font-medium">
              내용 <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="업데이트 내용을 작성하세요&#10;&#10;예:&#10;- 새로운 기능 추가&#10;- 버그 수정&#10;- 성능 개선"
              className="min-h-[400px] w-full px-4 py-3 border border-[#2C2C2C]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C84630] focus:border-[#C84630] bg-white text-[#2C2C2C] font-mono"
              required
            />
            <p className="text-sm text-[#2C2C2C]/60">줄바꿈과 공백이 그대로 유지됩니다.</p>
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="px-6"
          >
            취소
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="px-6 bg-[#C84630] hover:bg-[#A33520]"
          >
            {isSubmitting ? '저장 중...' : isEdit ? '수정하기' : '등록하기'}
          </Button>
        </div>
      </form>
    </>
  );
}
