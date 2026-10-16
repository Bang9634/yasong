import type { BiographySection } from '@/pages/story/types';
import { Plus, Trash2 } from 'lucide-react';
import { getFullImageUrl } from '@/utils/api';
import type { useBiographyEditor } from '../hooks/useBiographyEditor';

type BiographyEditorDialogProps = Pick<
  ReturnType<typeof useBiographyEditor>,
  | 'isEditModalOpen'
  | 'setIsEditModalOpen'
  | 'setEditingSections'
  | 'sections'
  | 'setImageFiles'
  | 'setImagePreviews'
  | 'editingSections'
  | 'imagePreviews'
  | 'isSaving'
  | 'handleSave'
>;

export function BiographyEditorDialog({
  isEditModalOpen,
  setIsEditModalOpen,
  setEditingSections,
  sections,
  setImageFiles,
  setImagePreviews,
  editingSections,
  imagePreviews,
  isSaving,
  handleSave,
}: BiographyEditorDialogProps) {
  return (
    <>
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#2C2C2C]">약력 섹션 수정</h2>
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingSections(sections);
                  setImageFiles({});
                  setImagePreviews({});
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-8">
              {editingSections.map((section, index) => (
                <div key={section.id} className="border-b pb-6 last:border-b-0">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-[#2C2C2C]">섹션 {index + 1}</h3>
                    {editingSections.length > 1 && (
                      <button
                        onClick={() => {
                          const sectionToRemove = editingSections[index];
                          const newSections = editingSections.filter((_, i) => i !== index);
                          setEditingSections(newSections);

                          // 삭제된 섹션의 이미지 파일과 미리보기도 제거
                          setImageFiles((prev) => {
                            const newFiles = { ...prev };
                            delete newFiles[sectionToRemove.id];
                            return newFiles;
                          });
                          setImagePreviews((prev) => {
                            const newPreviews = { ...prev };
                            delete newPreviews[sectionToRemove.id];
                            return newPreviews;
                          });
                        }}
                        className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" />
                        삭제
                      </button>
                    )}
                  </div>

                  <div className="space-y-4">
                    {/* 타이틀 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        타이틀 (예: BIOGRAPHY #1)
                      </label>
                      <input
                        type="text"
                        value={section.title}
                        onChange={(e) => {
                          const newSections = [...editingSections];
                          newSections[index].title = e.target.value;
                          setEditingSections(newSections);
                        }}
                        className="w-full p-3 border border-gray-300 rounded-lg"
                        placeholder="BIOGRAPHY #1"
                      />
                    </div>

                    {/* 제목 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">제목</label>
                      <input
                        type="text"
                        value={section.heading}
                        onChange={(e) => {
                          const newSections = [...editingSections];
                          newSections[index].heading = e.target.value;
                          setEditingSections(newSections);
                        }}
                        className="w-full p-3 border border-gray-300 rounded-lg"
                        placeholder="생애 초기 (1939-1960)"
                      />
                    </div>

                    {/* 내용 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        내용 (한 줄당 하나의 문장)
                      </label>
                      <textarea
                        value={section.description.join('\n')}
                        onChange={(e) => {
                          const newSections = [...editingSections];
                          newSections[index].description = e.target.value.split('\n');
                          setEditingSections(newSections);
                        }}
                        className="w-full p-3 border border-gray-300 rounded-lg h-40"
                        placeholder="내용을 입력하세요. 줄바꿈으로 문단을 구분합니다."
                      />
                    </div>

                    {/* 이미지 업로드 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">이미지</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            // 파일 저장
                            setImageFiles((prev) => ({ ...prev, [section.id]: file }));

                            // 미리보기 생성
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setImagePreviews((prev) => ({
                                ...prev,
                                [section.id]: reader.result as string,
                              }));
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="w-full p-3 border border-gray-300 rounded-lg"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        권장 크기: 1920x1080px 이상, 형식: JPG, PNG, WEBP
                      </p>

                      {/* 이미지 미리보기 */}
                      {(imagePreviews[section.id] || section.imageUrl) && (
                        <div className="mt-3 relative">
                          <img
                            src={imagePreviews[section.id] || getFullImageUrl(section.imageUrl)}
                            alt="미리보기"
                            className="w-full h-48 object-cover rounded border"
                            onError={(e) => {
                              e.currentTarget.src =
                                'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999"%3ENo Image%3C/text%3E%3C/svg%3E';
                            }}
                          />
                          {imagePreviews[section.id] && (
                            <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                              새 이미지
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* 이미지 위치 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        이미지 위치
                      </label>
                      <div className="flex gap-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            value="left"
                            checked={section.imagePosition === 'left'}
                            onChange={(e) => {
                              const newSections = [...editingSections];
                              newSections[index].imagePosition = e.target.value as 'left' | 'right';
                              setEditingSections(newSections);
                            }}
                            className="mr-2"
                          />
                          왼쪽
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            value="right"
                            checked={section.imagePosition === 'right'}
                            onChange={(e) => {
                              const newSections = [...editingSections];
                              newSections[index].imagePosition = e.target.value as 'left' | 'right';
                              setEditingSections(newSections);
                            }}
                            className="mr-2"
                          />
                          오른쪽
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 섹션 추가 버튼 */}
            <div className="mt-6 pt-6 border-t">
              <button
                onClick={() => {
                  const maxId =
                    editingSections.length > 0 ? Math.max(...editingSections.map((s) => s.id)) : 0;
                  const newSection: BiographySection = {
                    id: maxId + 1,
                    title: `BIOGRAPHY #${editingSections.length + 1}`,
                    heading: '새 섹션 제목',
                    description: ['새 섹션의 내용을 입력하세요.'],
                    imageUrl: '', // 빈 문자열로 초기화
                    imagePosition: editingSections.length % 2 === 0 ? 'left' : 'right',
                  };
                  setEditingSections([...editingSections, newSection]);
                }}
                className="w-full py-3 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-[#C84630] hover:text-[#C84630] transition-colors flex items-center justify-center gap-2"
                disabled={isSaving}
              >
                <Plus className="w-5 h-5" />
                <span>섹션 추가</span>
              </button>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingSections(sections);
                  setImageFiles({});
                  setImagePreviews({});
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
