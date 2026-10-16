import type { Story } from '@/pages/story/types';
import type { useStoryEditor } from '../hooks/useStoryEditor';

type StoryEditorDialogProps = Pick<
  ReturnType<typeof useStoryEditor>,
  | 'isEditModalOpen'
  | 'setIsEditModalOpen'
  | 'setEditingStories'
  | 'stories'
  | 'editingStories'
  | 'isSaving'
  | 'handleSave'
>;

export function StoryEditorDialog({
  isEditModalOpen,
  setIsEditModalOpen,
  setEditingStories,
  stories,
  editingStories,
  isSaving,
  handleSave,
}: StoryEditorDialogProps) {
  return (
    <>
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#2C2C2C]">스토리 내용 수정</h2>
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingStories(stories); // 취소 시 원래 값으로 복원
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-8">
              {editingStories.map((story, index) => (
                <div key={story.id} className="border-b pb-6 last:border-b-0">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      스토리 {index + 1} 제목
                    </label>
                    {editingStories.length > 1 && (
                      <button
                        onClick={() => {
                          const newStories = editingStories.filter((_, i) => i !== index);
                          setEditingStories(newStories);
                        }}
                        className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-1"
                      >
                        🗑️ 삭제
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={story.heading}
                    onChange={(e) => {
                      const newStories = [...editingStories];
                      newStories[index].heading = e.target.value;
                      setEditingStories(newStories);
                    }}
                    className="w-full p-3 border border-gray-300 rounded-lg mb-4"
                    placeholder="제목을 입력하세요"
                  />

                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    스토리 {index + 1} 내용 (한 줄당 하나의 문장)
                  </label>
                  <textarea
                    value={story.description.join('\n')}
                    onChange={(e) => {
                      const newStories = [...editingStories];
                      newStories[index].description = e.target.value.split('\n');
                      setEditingStories(newStories);
                    }}
                    className="w-full p-3 border border-gray-300 rounded-lg h-40"
                    placeholder="내용을 입력하세요. 줄바꿈으로 문단을 구분합니다."
                  />
                </div>
              ))}
            </div>

            {/* 스토리 추가 버튼 */}
            <div className="mt-6 pt-6 border-t">
              <button
                onClick={() => {
                  const maxId =
                    editingStories.length > 0 ? Math.max(...editingStories.map((s) => s.id)) : 0;
                  const newStory: Story = {
                    id: maxId + 1,
                    heading: '새 스토리 제목',
                    description: ['새 스토리의 내용을 입력하세요.'],
                  };
                  setEditingStories([...editingStories, newStory]);
                }}
                className="w-full py-3 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-[#C84630] hover:text-[#C84630] transition-colors flex items-center justify-center gap-2"
                disabled={isSaving}
              >
                <span className="text-xl">+</span>
                <span>스토리 추가</span>
              </button>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingStories(stories);
                }}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                disabled={isSaving}
              >
                취소
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-[#C84630] text-white rounded-lg hover:bg-[#A73925] disabled:opacity-50"
                disabled={isSaving}
              >
                {isSaving ? '저장 중...' : '저장'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
