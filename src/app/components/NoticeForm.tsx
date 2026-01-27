import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Checkbox } from '@/app/components/ui/checkbox';
import { useAuth } from '@/context/AuthContext';
import { noticeAPI, websiteAPI, getFullImageUrl } from '@/utils/api';
import { isManagerOrAbove } from '@/utils/auth';
import { FileText, Upload, X, Download, Image as ImageIcon, Paperclip } from 'lucide-react';

interface Attachment {
  id: number;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  contentType: string;
  uploadedAt: string;
}

export function NoticeForm() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [searchParams] = useSearchParams();
  const noticeId = searchParams.get('id');
  const isEdit = !!noticeId;

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'GENERAL',
    isPinned: false,
    status: 'PUBLISHED',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]); // 임시 첨부파일
  const contentRef = React.useRef<HTMLTextAreaElement>(null);

  // 권한 확인
  useEffect(() => {
    if (loading) return;
    
    if (!user || !isManagerOrAbove(user.role)) {
      alert('접근 권한이 없습니다.');
      navigate('/notice');
    }
  }, [user, loading, navigate]);

  // 수정일 경우 기존 데이터 로드
  useEffect(() => {
    if (!user || !isManagerOrAbove(user.role) || !isEdit || !noticeId) return;
    
    const fetchNotice = async () => {
      try {
        setIsLoading(true);
        const data = (user && isManagerOrAbove(user.role))
            ? await noticeAPI.getNoticeById(noticeId)
            : await noticeAPI.getVisibleNoticeById(noticeId);
        setFormData({
          title: data.title,
          content: data.content,
          category: data.category,
          isPinned: data.isPinned || false,
          status: data.status || 'PUBLISHED',
        });
        if (data.attachments) {
          setAttachments(data.attachments);
        }
      } catch (err) {
        console.error('공지사항 조회 실패:', err);
        alert('공지사항을 불러오는데 실패했습니다.');
        navigate('/notice');
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotice();
  }, [user, isEdit, noticeId, navigate]);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // 이미지 업로드 및 본문에 삽입
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 이미지 파일만 허용
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.');
      return;
    }

    // 파일 크기 체크 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('이미지 크기는 5MB를 초과할 수 없습니다.');
      return;
    }

    try {
      setUploadingImage(true);
      // 임시 이미지 타입으로 업로드
      const result = await websiteAPI.uploadImage('notice_content', file);
      const imageUrl = getFullImageUrl(result.imageUrl);
      
      // 현재 커서 위치에 이미지 마크다운 삽입
      const textarea = contentRef.current;
      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const currentContent = formData.content;
        const imageMarkdown = `\n![${file.name}](${imageUrl})\n`;
        const newContent = currentContent.substring(0, start) + imageMarkdown + currentContent.substring(end);
        setFormData({ ...formData, content: newContent });
        
        // 커서 위치 조정
        setTimeout(() => {
          textarea.focus();
          const newPosition = start + imageMarkdown.length;
          textarea.setSelectionRange(newPosition, newPosition);
        }, 0);
      } else {
        // textarea ref가 없으면 끝에 추가
        setFormData({ ...formData, content: formData.content + `\n![${file.name}](${imageUrl})\n` });
      }
      
      alert('이미지가 본문에 삽입되었습니다.');
      e.target.value = ''; // 파일 입력 초기화
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '이미지 업로드에 실패했습니다.';
      alert(`업로드 실패\n\n${errorMessage}`);
    } finally {
      setUploadingImage(false);
    }
  };

  // 임시 첨부파일 추가
  const handleAddPendingFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 파일 크기 체크 (10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('파일 크기는 10MB를 초과할 수 없습니다.');
      return;
    }

    // 중복 파일 체크
    if (pendingFiles.some(f => f.name === file.name && f.size === file.size)) {
      alert('이미 추가된 파일입니다.');
      return;
    }

    setPendingFiles([...pendingFiles, file]);
    e.target.value = ''; // 파일 입력 초기화
  };

  // 임시 첨부파일 제거
  const handleRemovePendingFile = (index: number) => {
    setPendingFiles(pendingFiles.filter((_, i) => i !== index));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 파일 크기 체크 (10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('파일 크기는 10MB를 초과할 수 없습니다.');
      return;
    }

    if (!noticeId) {
      alert('공지사항을 먼저 저장한 후 첨부파일을 업로드할 수 있습니다.');
      return;
    }

    try {
      setUploadingFile(true);
      const result = await noticeAPI.uploadAttachment(noticeId, file);
      setAttachments([...attachments, result]);
      alert('첨부파일이 업로드되었습니다.');
      e.target.value = ''; // 파일 입력 초기화
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '파일 업로드에 실패했습니다.';
      alert(`업로드 실패\n\n${errorMessage}`);
    } finally {
      setUploadingFile(false);
    }
  };

  const handleDeleteAttachment = async (attachmentId: number) => {
    if (!noticeId) return;
    
    if (!confirm('이 첨부파일을 삭제하시겠습니까?')) return;

    try {
      await noticeAPI.deleteAttachment(noticeId, attachmentId);
      setAttachments(attachments.filter(a => a.id !== attachmentId));
      alert('첨부파일이 삭제되었습니다.');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '삭제에 실패했습니다.';
      alert(`삭제 실패\n\n${errorMessage}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }

    try {
      setIsSubmitting(true);
      let savedNoticeId = noticeId;
      
      if (isEdit && noticeId) {
        await noticeAPI.updateNotice(noticeId, formData);
      } else {
        const result = await noticeAPI.createNotice(formData);
        savedNoticeId = result.id?.toString();
      }

      // 임시 첨부파일이 있으면 업로드
      if (pendingFiles.length > 0 && savedNoticeId) {
        for (const file of pendingFiles) {
          try {
            await noticeAPI.uploadAttachment(savedNoticeId, file);
          } catch (err) {
            console.error('첨부파일 업로드 실패:', file.name, err);
          }
        }
        setPendingFiles([]); // 업로드 완료 후 초기화
      }

      alert(isEdit ? '공지사항이 수정되었습니다.' : '공지사항이 작성되었습니다.');
      navigate('/notice');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '작업에 실패했습니다.';
      alert(`실패\n\n${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || !user || !isManagerOrAbove(user.role)) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-24 pb-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-gray-500">로딩 중...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 페이지 헤더 */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-teal-900 mb-2">
              {isEdit ? '공지사항 수정' : '공지사항 작성'}
            </h1>
            <p className="text-gray-600">
              {isEdit ? '공지사항을 수정합니다.' : '새로운 공지사항을 작성합니다.'}
            </p>
          </div>

          {/* 작성 폼 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="category">카테고리 *</Label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                >
                  <option value="GENERAL">일반</option>
                  <option value="EXHIBITION">전시</option>
                  <option value="CONTEST">공모전</option>
                  <option value="MAINTENANCE">시스템</option>
                </select>
              </div>

              <div>
                <Label htmlFor="title">제목 *</Label>
                <Input
                  id="title"
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="제목을 입력해주세요"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="content">내용 *</Label>
                  <div className="flex gap-2">
                    <label className="cursor-pointer px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors flex items-center">
                      <ImageIcon className="w-4 h-4 mr-1" />
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
                  rows={15}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  💡 이미지는 Markdown 형식으로 삽입됩니다. 예: ![이미지설명](URL)
                </p>
              </div>

              <div className="flex items-center space-x-2 mb-4">
                <Checkbox
                  id="isPinned"
                  checked={formData.isPinned}
                  onCheckedChange={(checked) => 
                    setFormData({ ...formData, isPinned: checked as boolean })
                  }
                />
                <Label htmlFor="isPinned" className="text-sm font-normal cursor-pointer">
                  상단 고정
                </Label>
              </div>

              <div>
                <Label htmlFor="status">게시 상태 *</Label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                >
                  <option value="PUBLISHED">게시됨</option>
                  <option value="DRAFT">임시저장</option>
                  <option value="HIDDEN">숨김</option>
                </select>
              </div>

              {/* 첨부파일 섹션 */}
              <div className="border-t pt-6">
                <Label className="mb-3 block">
                  <Paperclip className="inline w-4 h-4 mr-2" />
                  첨부파일 {!isEdit && '(공지사항 저장 시 함께 업로드됩니다)'}
                </Label>
                
                {/* 첨부파일 추가 */}
                <div className="mb-4">
                  <label className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-teal-500 hover:bg-teal-50 transition-colors">
                    <Upload className="w-5 h-5 mr-2 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {isEdit && noticeId ? (uploadingFile ? '업로드 중...' : '파일 추가 (최대 10MB)') : '파일 선택 (최대 10MB)'}
                    </span>
                    <input
                      type="file"
                      onChange={isEdit && noticeId ? handleFileUpload : handleAddPendingFile}
                      disabled={uploadingFile}
                      className="hidden"
                      accept=".pdf,.hwp,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.jpg,.jpeg,.png,.gif,.webp"
                    />
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    지원 형식: PDF, HWP, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, ZIP, 이미지
                  </p>
                </div>

                {/* 임시 첨부파일 목록 (신규 작성 시) */}
                {!isEdit && pendingFiles.length > 0 && (
                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-gray-600 mb-2">대기 중인 파일 ({pendingFiles.length})</p>
                    {pendingFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <FileText className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {file.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatFileSize(file.size)}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemovePendingFile(index)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded transition-colors"
                          title="제거"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* 업로드된 첨부파일 목록 (수정 시) */}
                {isEdit && attachments.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 mb-2">업로드된 파일 ({attachments.length})</p>
                    {attachments.map((attachment) => (
                      <div
                        key={attachment.id}
                        className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <FileText className="w-5 h-5 text-green-600 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {attachment.fileName}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatFileSize(attachment.fileSize)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <a
                            href={getFullImageUrl(attachment.fileUrl)}
                            download={attachment.fileName}
                            className="p-2 text-teal-600 hover:bg-teal-100 rounded transition-colors"
                            title="다운로드"
                          >
                            <Download className="w-4 h-4" />
                          </a>
                          <button
                            type="button"
                            onClick={() => handleDeleteAttachment(attachment.id)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded transition-colors"
                            title="삭제"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-teal-600 hover:bg-teal-700 text-white"
                >
                  {isSubmitting ? '처리 중...' : isEdit ? '수정하기' : '작성하기'}
                </Button>
                <Button
                  type="button"
                  onClick={() => navigate('/notice')}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800"
                >
                  취소
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
