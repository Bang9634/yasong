import { useState, useEffect } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { Calendar, MapPin, Search, Plus, Edit, Trash2, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { exhibitionAPI } from '@/utils/api';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/app/components/ui/pagination';
import { useAuth } from '@/context/AuthContext';
import { isManagerOrAbove } from '@/utils/auth';
import { resizeImage } from '@/utils/imageUtils';

interface Exhibition {
  id: number;
  title: string;
  artist: string;
  location: string;
  imageUrl: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'ONGOING' | 'UPCOMING' | 'PAST';
}

type StatusFilter = 'ALL' | 'ONGOING' | 'UPCOMING' | 'PAST';

export function ExhibitionsPage() {
  const { user } = useAuth();
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // 관리자 권한 확인
  const canManage = user && isManagerOrAbove(user.role);

  // 전시 폼 관리
  const [showForm, setShowForm] = useState(false);
  const [editingExhibition, setEditingExhibition] = useState<Exhibition | null>(null);
  const [exhibitionForm, setExhibitionForm] = useState({
    title: '',
    artist: '',
    location: '',
    description: '',
    startDate: '',
    endDate: '',
  });
  const [exhibitionImage, setExhibitionImage] = useState<File | null>(null);
  const [exhibitionImagePreview, setExhibitionImagePreview] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedExhibition, setSelectedExhibition] = useState<Exhibition | null>(null);

  useEffect(() => {
    const fetchExhibitions = async () => {
      try {
        setIsLoading(true);
        const data = await exhibitionAPI.getAllExhibitions();
        setExhibitions(data);
      } catch (err) {
        console.error('전시 조회 실패:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExhibitions();
  }, []);

  const getImageUrl = (imageUrl: string) => {
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    return `${import.meta.env.VITE_API_BASE_URL || ''}${imageUrl}`;
  };

  const openDetailModal = (exhibition: Exhibition) => {
    setSelectedExhibition(exhibition);
    setIsDetailModalOpen(true);
  };

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedExhibition(null);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ONGOING':
        return <span className="px-3 py-1 bg-teal-600 text-white text-sm rounded-full">전시 중</span>;
      case 'UPCOMING':
        return <span className="px-3 py-1 bg-amber-500 text-white text-sm rounded-full">전시 예정</span>;
      case 'PAST':
        return <span className="px-3 py-1 bg-gray-400 text-white text-sm rounded-full">지난 전시</span>;
      default:
        return null;
    }
  };

  const getStatusDisplayName = (status: StatusFilter) => {
    switch (status) {
      case 'ALL':
        return '전체';
      case 'ONGOING':
        return '전시 중';
      case 'UPCOMING':
        return '전시 예정';
      case 'PAST':
        return '지난 전시';
      default:
        return '전체';
    }
  };

  // 이미지 선택 및 리사이징
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const resizedImage = await resizeImage(file, 1200, 800);
      setExhibitionImage(resizedImage);

      const reader = new FileReader();
      reader.onloadend = () => {
        setExhibitionImagePreview(reader.result as string);
      };
      reader.readAsDataURL(resizedImage);
    } catch (err) {
      console.error('이미지 리사이징 실패:', err);
      alert('이미지 처리에 실패했습니다.');
    }
  };

  // 추가 폼 열기
  const handleOpenAddForm = () => {
    setEditingExhibition(null);
    setExhibitionForm({
      title: '',
      artist: '',
      location: '',
      description: '',
      startDate: '',
      endDate: '',
    });
    setExhibitionImage(null);
    setExhibitionImagePreview('');
    setShowForm(true);
  };

  // 수정 폼 열기
  const handleOpenEditForm = (exhibition: Exhibition) => {
    setEditingExhibition(exhibition);
    
    const startDate = new Date(exhibition.startDate).toISOString().slice(0, 10);
    const endDate = new Date(exhibition.endDate).toISOString().slice(0, 10);
    
    setExhibitionForm({
      title: exhibition.title,
      artist: exhibition.artist,
      location: exhibition.location,
      description: exhibition.description,
      startDate: startDate,
      endDate: endDate,
    });
    setExhibitionImage(null);
    setExhibitionImagePreview(getImageUrl(exhibition.imageUrl));
    setShowForm(true);
  };

  // 폼 취소
  const handleCancelForm = () => {
    setShowForm(false);
    setEditingExhibition(null);
    setExhibitionForm({
      title: '',
      artist: '',
      location: '',
      description: '',
      startDate: '',
      endDate: '',
    });
    setExhibitionImage(null);
    setExhibitionImagePreview('');
  };

  // 전시 생성
  const handleCreate = async () => {
    if (!exhibitionForm.title || !exhibitionForm.artist || !exhibitionForm.location || 
        !exhibitionForm.description || !exhibitionForm.startDate || !exhibitionForm.endDate) {
      alert('모든 필드를 입력해주세요.');
      return;
    }
    if (!exhibitionImage) {
      alert('이미지를 선택해주세요.');
      return;
    }

    if (new Date(exhibitionForm.startDate) > new Date(exhibitionForm.endDate)) {
      alert('종료일은 시작일보다 늦어야 합니다.');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // LocalDateTime 형식 (YYYY-MM-DDTHH:mm:ss)
      const startDateTime = exhibitionForm.startDate + 'T00:00:01';
      const endDateTime = exhibitionForm.endDate + 'T23:59:59';
      
      const formData = {
        ...exhibitionForm,
        startDate: startDateTime,
        endDate: endDateTime,
      };
      
      await exhibitionAPI.createExhibition(formData, exhibitionImage);
      
      const updated = await exhibitionAPI.getAllExhibitions();
      setExhibitions(updated);
      
      alert('전시가 추가되었습니다.');
      handleCancelForm();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '추가에 실패했습니다.';
      alert(`실패\n\n${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 전시 수정
  const handleUpdate = async () => {
    if (!editingExhibition) return;
    
    if (!exhibitionForm.title || !exhibitionForm.artist || !exhibitionForm.location || 
        !exhibitionForm.description || !exhibitionForm.startDate || !exhibitionForm.endDate) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    if (new Date(exhibitionForm.startDate) >= new Date(exhibitionForm.endDate)) {
      alert('종료일은 시작일보다 늦어야 합니다.');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // LocalDateTime 형식 (YYYY-MM-DDTHH:mm:ss)
      const startDateTime = exhibitionForm.startDate + 'T00:00:00';
      const endDateTime = exhibitionForm.endDate + 'T23:59:59';
      
      const formData = {
        ...exhibitionForm,
        startDate: startDateTime,
        endDate: endDateTime,
      };
      
      await exhibitionAPI.updateExhibition(editingExhibition.id, formData, exhibitionImage || undefined);
      
      const updated = await exhibitionAPI.getAllExhibitions();
      setExhibitions(updated);
      
      alert('전시가 수정되었습니다.');
      handleCancelForm();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '수정에 실패했습니다.';
      alert(`실패\n\n${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 전시 삭제
  const handleDelete = async (id: number) => {
    if (!confirm('이 전시를 삭제하시겠습니까?')) return;

    try {
      await exhibitionAPI.deleteExhibition(id);
      
      const updated = await exhibitionAPI.getAllExhibitions();
      setExhibitions(updated);
      
      alert('전시가 삭제되었습니다.');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '삭제에 실패했습니다.';
      alert(`실패\n\n${errorMessage}`);
    }
  };

  // 필터링된 전시 목록
  const filteredExhibitions = exhibitions.filter((exhibition) => {
    const matchesStatus = statusFilter === 'ALL' || exhibition.status === statusFilter;
    const matchesSearch =
      searchQuery === '' ||
      exhibition.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exhibition.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exhibition.location.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  // 페이지네이션 계산
  const totalPages = Math.ceil(filteredExhibitions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentExhibitions = filteredExhibitions.slice(startIndex, endIndex);

  // 필터나 검색이 변경되면 1페이지로 리셋
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, searchQuery]);

  // 페이지 변경 시 맨 위로 스크롤
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="pt-32 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 페이지 헤더 */}
          <div className="mb-8 flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold text-teal-900 mb-2">전시 일정</h1>
              <p className="text-gray-600">청송야송미술관의 모든 전시 일정을 확인하세요</p>
            </div>
            {canManage && (
              <Button onClick={handleOpenAddForm} className="bg-teal-700 hover:bg-teal-800">
                <Plus className="w-4 h-4 mr-2" />
                전시 추가
              </Button>
            )}
          </div>

          {/* 필터 및 검색 */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              {/* 상태 필터 */}
              <div className="flex gap-2 flex-wrap">
                {(['ALL', 'ONGOING', 'UPCOMING', 'PAST'] as StatusFilter[]).map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      statusFilter === status
                        ? 'bg-teal-700 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {getStatusDisplayName(status)}
                  </button>
                ))}
              </div>

              {/* 검색 */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="전시명, 작가, 장소로 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full"
                />
              </div>
            </div>
          </div>

          {/* 전시 목록 */}
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">로딩 중...</p>
            </div>
          ) : filteredExhibitions.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <p className="text-gray-500">조건에 맞는 전시가 없습니다.</p>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {currentExhibitions.map((exhibition) => (
                <div
                  key={exhibition.id}
                  className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow border border-teal-100 flex flex-col h-[550px]"
                >
                  <div className="relative flex-shrink-0 cursor-pointer" onClick={() => openDetailModal(exhibition)}>
                    <ImageWithFallback
                      src={getImageUrl(exhibition.imageUrl)}
                      alt={exhibition.title}
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute top-4 right-4">
                      {getStatusBadge(exhibition.status)}
                    </div>
                  </div>

                  <div className="p-6 bg-gradient-to-b from-white to-teal-50 flex-1 flex flex-col">
                    <div className="cursor-pointer flex-1" onClick={() => openDetailModal(exhibition)}>
                      <h3 className="text-2xl mb-2 text-teal-900 hover:text-teal-700 transition-colors">{exhibition.title}</h3>
                      <p className="text-gray-600 mb-4">{exhibition.artist}</p>

                      <div className="space-y-2 text-sm text-gray-600 mb-4">
                        <div className="flex items-start">
                          <Calendar className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-teal-600" />
                          <span>{formatDate(exhibition.startDate)} - {formatDate(exhibition.endDate)}</span>
                        </div>
                        <div className="flex items-start">
                          <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-teal-600" />
                          <span>{exhibition.location}</span>
                        </div>
                      </div>

                      <p className="text-gray-700 leading-relaxed border-t border-teal-200 pt-4 line-clamp-3">
                        {exhibition.description}
                      </p>
                    </div>

                    {canManage && (
                      <div className="flex gap-2 mt-4 pt-4 border-t border-teal-200">
                        <Button
                          onClick={() => handleOpenEditForm(exhibition)}
                          variant="outline"
                          size="sm"
                          className="flex-1"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          수정
                        </Button>
                        <Button
                          onClick={() => handleDelete(exhibition.id)}
                          variant="outline"
                          size="sm"
                          className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          삭제
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              </div>

              {/* 페이지네이션 */}
              {totalPages > 1 && (
                <div className="mt-12">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                          className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                      </PaginationItem>
                      
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => setCurrentPage(page)}
                            isActive={currentPage === page}
                            className="cursor-pointer"
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      
                      <PaginationItem>
                        <PaginationNext
                          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                          className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}

          {/* 결과 개수 */}
          {!isLoading && (
            <div className="mt-8 text-center text-gray-600">
              총 {filteredExhibitions.length}개의 전시
            </div>
          )}

          {/* 전시 추가/수정 폼 */}
          {showForm && (
            <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-teal-900 mb-6">
                    {editingExhibition ? '전시 수정' : '전시 추가'}
                  </h2>

                  <div className="space-y-4">
                    {/* 이미지 업로드 */}
                    <div>
                      <Label htmlFor="exhibition-image">전시 이미지</Label>
                      <Input
                        id="exhibition-image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="mt-1"
                      />
                      {exhibitionImagePreview && (
                        <div className="mt-2">
                          <img
                            src={exhibitionImagePreview}
                            alt="미리보기"
                            className="w-full h-64 object-cover rounded-lg"
                          />
                        </div>
                      )}
                    </div>

                    {/* 전시명 */}
                    <div>
                      <Label htmlFor="exhibition-title">전시명</Label>
                      <Input
                        id="exhibition-title"
                        value={exhibitionForm.title}
                        onChange={(e) =>
                          setExhibitionForm({ ...exhibitionForm, title: e.target.value })
                        }
                        placeholder="전시명을 입력하세요"
                        className="mt-1"
                      />
                    </div>

                    {/* 작가명 */}
                    <div>
                      <Label htmlFor="exhibition-artist">작가명</Label>
                      <Input
                        id="exhibition-artist"
                        value={exhibitionForm.artist}
                        onChange={(e) =>
                          setExhibitionForm({ ...exhibitionForm, artist: e.target.value })
                        }
                        placeholder="작가명을 입력하세요"
                        className="mt-1"
                      />
                    </div>

                    {/* 전시 기간 */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="exhibition-start-date">전시 시작일</Label>
                        <Input
                          id="exhibition-start-date"
                          type="date"
                          value={exhibitionForm.startDate}
                          onChange={(e) =>
                            setExhibitionForm({ ...exhibitionForm, startDate: e.target.value })
                          }
                          className="mt-1"
                        />
                        <p className="text-xs text-gray-500 mt-1">00:00 기준</p>
                      </div>
                      <div>
                        <Label htmlFor="exhibition-end-date">전시 종료일</Label>
                        <Input
                          id="exhibition-end-date"
                          type="date"
                          value={exhibitionForm.endDate}
                          onChange={(e) =>
                            setExhibitionForm({ ...exhibitionForm, endDate: e.target.value })
                          }
                          className="mt-1"
                        />
                        <p className="text-xs text-gray-500 mt-1">23:59 기준</p>
                      </div>
                    </div>

                    {/* 전시 장소 */}
                    <div>
                      <Label htmlFor="exhibition-location">전시 장소</Label>
                      <Input
                        id="exhibition-location"
                        value={exhibitionForm.location}
                        onChange={(e) =>
                          setExhibitionForm({ ...exhibitionForm, location: e.target.value })
                        }
                        placeholder="전시 장소를 입력하세요"
                        className="mt-1"
                      />
                    </div>

                    {/* 전시 설명 */}
                    <div>
                      <Label htmlFor="exhibition-description">전시 설명</Label>
                      <Textarea
                        id="exhibition-description"
                        value={exhibitionForm.description}
                        onChange={(e) =>
                          setExhibitionForm({ ...exhibitionForm, description: e.target.value })
                        }
                        placeholder="전시 설명을 입력하세요"
                        rows={6}
                        className="mt-1"
                      />
                    </div>

                    {/* 버튼 */}
                    <div className="flex justify-end gap-2 pt-4">
                      <Button
                        onClick={handleCancelForm}
                        variant="outline"
                        disabled={isSubmitting}
                      >
                        취소
                      </Button>
                      <Button
                        onClick={editingExhibition ? handleUpdate : handleCreate}
                        disabled={isSubmitting}
                        className="bg-teal-700 hover:bg-teal-800"
                      >
                        {isSubmitting ? '처리 중...' : editingExhibition ? '수정' : '추가'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 상세보기 모달 */}
      {isDetailModalOpen && selectedExhibition && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={closeDetailModal}>
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10">
              <h2 className="text-2xl font-bold text-teal-900">전시 상세</h2>
              <button onClick={closeDetailModal} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-8">
                {/* 이미지 */}
                <div className="relative">
                  <ImageWithFallback
                    src={getImageUrl(selectedExhibition.imageUrl)}
                    alt={selectedExhibition.title}
                    className="w-full h-auto rounded-lg shadow-lg object-contain max-h-[500px]"
                  />
                  <div className="absolute top-4 right-4">
                    {getStatusBadge(selectedExhibition.status)}
                  </div>
                </div>

                {/* 정보 */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-3xl font-bold text-teal-900 mb-2">{selectedExhibition.title}</h3>
                    <p className="text-xl text-gray-600 mb-4">{selectedExhibition.artist}</p>
                    
                    <div className="space-y-3 text-gray-700">
                      <div className="flex items-start">
                        <Calendar className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0 text-teal-600" />
                        <div>
                          <span className="font-semibold">전시 기간:</span>
                          <br />
                          <span>{formatDate(selectedExhibition.startDate)} - {formatDate(selectedExhibition.endDate)}</span>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <MapPin className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0 text-teal-600" />
                        <div>
                          <span className="font-semibold">장소:</span>
                          <br />
                          <span>{selectedExhibition.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <h4 className="font-semibold text-lg text-teal-900 mb-3">전시 소개</h4>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {selectedExhibition.description}
                    </p>
                  </div>

                  {canManage && (
                    <div className="border-t border-gray-200 pt-6">
                      <div className="flex gap-3">
                        <Button
                          onClick={() => {
                            closeDetailModal();
                            handleOpenEditForm(selectedExhibition);
                          }}
                          variant="outline"
                          className="flex-1"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          수정
                        </Button>
                        <Button
                          onClick={async () => {
                            if (confirm('정말 삭제하시겠습니까?')) {
                              await handleDelete(selectedExhibition.id);
                              closeDetailModal();
                            }
                          }}
                          variant="outline"
                          className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          삭제
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
