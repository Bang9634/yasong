import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/app/components/Header';
import { Footer } from '@/app/components/Footer';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { ShoppingBag, Search, Plus, Edit, Trash2, X } from 'lucide-react';
import { souvenirAPI, getFullImageUrl } from '@/utils/api';
import { useAuth } from '@/context/AuthContext';

interface Souvenir {
  id: number;
  name: string;
  imageUrl: string;
  description: string;
  price: number;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export function SouvenirsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [souvenirs, setSouvenirs] = useState<Souvenir[]>([]);
  const [filteredSouvenirs, setFilteredSouvenirs] = useState<Souvenir[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    isPinned: false,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [currentImageUrl, setCurrentImageUrl] = useState<string>('');

  const isAdmin = user?.role === 'ADMIN' || user?.role === 'MANAGER';

  useEffect(() => {
    loadSouvenirs();
  }, []);

  useEffect(() => {
    // 검색 필터링
    if (searchQuery.trim() === '') {
      setFilteredSouvenirs(souvenirs);
    } else {
      const filtered = souvenirs.filter(s => 
        s.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredSouvenirs(filtered);
    }
  }, [searchQuery, souvenirs]);

  const loadSouvenirs = async () => {
    try {
      const data = await souvenirAPI.getAllSouvenirs();
      setSouvenirs(data);
      setFilteredSouvenirs(data);
    } catch (error) {
      console.error('Failed to load souvenirs:', error);
      alert('기념품 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const openAddForm = () => {
    setEditingId(null);
    setFormData({ name: '', description: '', price: '', isPinned: false });
    setImageFile(null);
    setImagePreview('');
    setCurrentImageUrl('');
    setShowForm(true);
  };

  const openEditForm = (souvenir: Souvenir) => {
    setEditingId(souvenir.id);
    setFormData({
      name: souvenir.name,
      description: souvenir.description,
      price: souvenir.price.toString(),
      isPinned: souvenir.isPinned,
    });
    setImageFile(null);
    setImagePreview('');
    setCurrentImageUrl(souvenir.imageUrl);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ name: '', description: '', price: '', isPinned: false });
    setImageFile(null);
    setImagePreview('');
    setCurrentImageUrl('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      alert('기념품 이름을 입력해주세요.');
      return;
    }
    if (!formData.description.trim()) {
      alert('설명을 입력해주세요.');
      return;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      alert('올바른 가격을 입력해주세요.');
      return;
    }

    // isPinned 체크: 새로 추가하거나 수정할 때 isPinned를 true로 하려면 현재 6개 미만이어야 함
    if (formData.isPinned) {
      const currentPinned = souvenirs.filter(s => s.isPinned && s.id !== editingId);
      if (currentPinned.length >= 6) {
        alert('홈페이지에 고정할 수 있는 기념품은 최대 6개입니다.');
        return;
      }
    }

    // 새로 추가할 때는 이미지 필수
    if (!editingId && !imageFile) {
      alert('기념품 이미지를 선택해주세요.');
      return;
    }

    try {
      const data = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        isPinned: formData.isPinned,
      };

      if (editingId) {
        // 수정
        await souvenirAPI.updateSouvenir(editingId, data, imageFile || undefined);
        alert('기념품이 수정되었습니다.');
      } else {
        // 추가
        await souvenirAPI.createSouvenir(data, imageFile!);
        alert('기념품이 추가되었습니다.');
      }

      closeForm();
      loadSouvenirs();
    } catch (error: any) {
      console.error('Failed to save souvenir:', error);
      alert(error.message || '기념품 저장에 실패했습니다.');
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`"${name}" 기념품을 삭제하시겠습니까?`)) {
      return;
    }

    try {
      await souvenirAPI.deleteSouvenir(id);
      alert('기념품이 삭제되었습니다.');
      loadSouvenirs();
    } catch (error: any) {
      console.error('Failed to delete souvenir:', error);
      alert(error.message || '기념품 삭제에 실패했습니다.');
    }
  };

  const formatPrice = (price: number) => {
    return `${price.toLocaleString()}원`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* 헤더 */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <ShoppingBag className="w-10 h-10 text-teal-800 mr-3" />
              <h1 className="text-4xl sm:text-5xl text-teal-900">기념품</h1>
            </div>
            <div className="w-20 h-1 bg-amber-600 mx-auto mb-6"></div>
            <p className="text-lg text-gray-600">
              이원좌 화백의 예술 세계를 담은 다양한 문화상품
            </p>
          </div>

          {/* 검색 및 추가 버튼 */}
          <div className="mb-8 flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="기념품 이름으로 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              />
            </div>
            
            {isAdmin && (
              <button
                onClick={openAddForm}
                className="flex items-center gap-2 px-6 py-2 bg-teal-700 text-white rounded-lg hover:bg-teal-800 transition-colors"
              >
                <Plus className="w-5 h-5" />
                기념품 추가
              </button>
            )}
          </div>

          {/* 기념품 목록 */}
          {loading ? (
            <div className="text-center py-12">로딩 중...</div>
          ) : filteredSouvenirs.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              {searchQuery ? '검색 결과가 없습니다.' : '등록된 기념품이 없습니다.'}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredSouvenirs.map((souvenir) => (
                <div
                  key={souvenir.id}
                  className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow border border-gray-200 group"
                >
                  <div className="relative overflow-hidden">
                    <ImageWithFallback
                      src={getFullImageUrl(souvenir.imageUrl)}
                      alt={souvenir.name}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    {souvenir.isPinned && (
                      <div className="absolute top-4 left-4">
                        <span className="bg-amber-600 text-white text-xs px-3 py-1 rounded-full font-semibold">
                          홈페이지 고정
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2 text-teal-900">{souvenir.name}</h3>
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                      {souvenir.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-teal-700">{formatPrice(souvenir.price)}</span>
                      
                      {isAdmin && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEditForm(souvenir)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="수정"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(souvenir.id, souvenir.name)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="삭제"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* 추가/수정 폼 모달 */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-teal-900">
                {editingId ? '기념품 수정' : '기념품 추가'}
              </h2>
              <button
                onClick={closeForm}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* 이미지 업로드 */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  기념품 이미지 {!editingId && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                />
                {(imagePreview || currentImageUrl) && (
                  <div className="mt-4">
                    <img
                      src={imagePreview || getFullImageUrl(currentImageUrl)}
                      alt="미리보기"
                      className="w-full h-64 object-cover rounded-lg border border-gray-200"
                    />
                  </div>
                )}
              </div>

              {/* 이름 */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  기념품 이름 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  placeholder="예: 이원좌 작품집"
                />
              </div>

              {/* 가격 */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  가격 (원) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  placeholder="35000"
                  min="0"
                  step="100"
                />
              </div>

              {/* 설명 */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  설명 <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  rows={4}
                  placeholder="기념품에 대한 설명을 입력하세요."
                />
              </div>

              {/* 홈페이지 고정 */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isPinned"
                  checked={formData.isPinned}
                  onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })}
                  className="w-5 h-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                />
                <label htmlFor="isPinned" className="text-sm font-medium text-gray-700">
                  홈페이지 뮤지엄샵 섹션에 고정 (최대 6개)
                </label>
              </div>

              {/* 버튼 */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeForm}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-teal-700 text-white rounded-lg hover:bg-teal-800 transition-colors font-semibold"
                >
                  {editingId ? '수정하기' : '추가하기'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
