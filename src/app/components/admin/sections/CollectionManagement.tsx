import { useState, useEffect } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { collectionAPI } from '@/utils/api';
import { resizeImage } from '@/utils/imageUtils';
import { Plus, Edit, Trash2 } from 'lucide-react';

interface Collection {
  id: number;
  title: string;
  year: string;
  size: string;
  imageUrl: string;
  description: string;
  displayOrder: number;
}

interface CollectionManagementProps {
  initialCollections?: Collection[];
}

export function CollectionManagement({ initialCollections = [] }: CollectionManagementProps) {
  const [collections, setCollections] = useState<Collection[]>(initialCollections);
  const [isCollectionLoading, setIsCollectionLoading] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  const [showCollectionForm, setShowCollectionForm] = useState(false);
  const [collectionForm, setCollectionForm] = useState({
    title: '',
    year: '',
    size: '',
    description: '',
    displayOrder: 0,
  });
  const [collectionImage, setCollectionImage] = useState<File | null>(null);
  const [collectionImagePreview, setCollectionImagePreview] = useState<string>('');

  useEffect(() => {
    if (initialCollections && initialCollections.length > 0) {
      setCollections(initialCollections);
    }
  }, [initialCollections]);

  const handleCollectionImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const resizedImage = await resizeImage(file, 1200, 1200);
      setCollectionImage(resizedImage);

      const reader = new FileReader();
      reader.onloadend = () => {
        setCollectionImagePreview(reader.result as string);
      };
      reader.readAsDataURL(resizedImage);
    } catch (err) {
      console.error('이미지 리사이징 실패:', err);
      alert('이미지 처리에 실패했습니다.');
    }
  };

  const handleOpenAddCollectionForm = () => {
    setEditingCollection(null);
    setCollectionForm({
      title: '',
      year: '',
      size: '',
      description: '',
      displayOrder: collections.length > 0 ? Math.max(...collections.map(c => c.displayOrder)) + 1 : 1,
    });
    setCollectionImage(null);
    setCollectionImagePreview('');
    setShowCollectionForm(true);
  };

  const handleOpenEditCollectionForm = (collection: Collection) => {
    setEditingCollection(collection);
    setCollectionForm({
      title: collection.title,
      year: collection.year,
      size: collection.size,
      description: collection.description,
      displayOrder: collection.displayOrder,
    });
    setCollectionImage(null);
    
    const imageUrl = collection.imageUrl.startsWith('http') 
      ? collection.imageUrl 
      : `${import.meta.env.VITE_API_BASE_URL || ''}${collection.imageUrl}`;
    setCollectionImagePreview(imageUrl);
    setShowCollectionForm(true);
  };

  const handleCancelCollectionForm = () => {
    setShowCollectionForm(false);
    setEditingCollection(null);
    setCollectionForm({
      title: '',
      year: '',
      size: '',
      description: '',
      displayOrder: 0,
    });
    setCollectionImage(null);
    setCollectionImagePreview('');
  };

  const handleCreateCollection = async () => {
    if (!collectionForm.title || !collectionForm.year || !collectionForm.size || !collectionForm.description) {
      alert('모든 필드를 입력해주세요.');
      return;
    }
    if (!collectionImage) {
      alert('이미지를 선택해주세요.');
      return;
    }

    try {
      setIsCollectionLoading(true);
      await collectionAPI.createCollection(collectionForm, collectionImage);
      
      const updated = await collectionAPI.getAllCollections();
      setCollections(updated.sort((a, b) => a.displayOrder - b.displayOrder));
      
      alert('소장품이 추가되었습니다.');
      handleCancelCollectionForm();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '추가에 실패했습니다.';
      alert(`실패\n\n${errorMessage}`);
    } finally {
      setIsCollectionLoading(false);
    }
  };

  const handleUpdateCollection = async () => {
    if (!editingCollection) return;
    
    if (!collectionForm.title || !collectionForm.year || !collectionForm.size || !collectionForm.description) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    try {
      setIsCollectionLoading(true);
      await collectionAPI.updateCollection(editingCollection.id, collectionForm, collectionImage || undefined);
      
      const updated = await collectionAPI.getAllCollections();
      setCollections(updated.sort((a, b) => a.displayOrder - b.displayOrder));
      
      alert('소장품이 수정되었습니다.');
      handleCancelCollectionForm();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '수정에 실패했습니다.';
      alert(`실패\n\n${errorMessage}`);
    } finally {
      setIsCollectionLoading(false);
    }
  };

  const handleDeleteCollection = async (id: number) => {
    if (!confirm('이 소장품을 삭제하시겠습니까?')) return;

    try {
      setIsCollectionLoading(true);
      await collectionAPI.deleteCollection(id);
      
      const updated = await collectionAPI.getAllCollections();
      setCollections(updated.sort((a, b) => a.displayOrder - b.displayOrder));
      
      alert('소장품이 삭제되었습니다.');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '삭제에 실패했습니다.';
      alert(`실패\n\n${errorMessage}`);
    } finally {
      setIsCollectionLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">소장품 관리</h2>
          <p className="text-sm text-gray-600 mt-1">대표 소장품 섹션에 표시될 작품들을 관리할 수 있습니다.</p>
        </div>
        <Button
          onClick={handleOpenAddCollectionForm}
          className="bg-teal-700 hover:bg-teal-800 text-white"
          disabled={isCollectionLoading}
        >
          <Plus className="w-4 h-4 mr-2" />
          소장품 추가
        </Button>
      </div>

      {collections.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          등록된 소장품이 없습니다.
        </div>
      ) : (
        <div className="space-y-4 mb-6">
          {collections.map((collection) => (
            <div
              key={collection.id}
              className="border border-gray-200 rounded-lg p-4 hover:border-teal-500 transition-colors"
            >
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <img
                    src={
                      collection.imageUrl.startsWith('http')
                        ? collection.imageUrl
                        : `${import.meta.env.VITE_API_BASE_URL || ''}${collection.imageUrl}`
                    }
                    alt={collection.title}
                    className="w-32 h-32 object-cover rounded-md"
                  />
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{collection.title}</h3>
                  <div className="text-sm text-gray-600 space-y-1 mb-2">
                    <p>제작연도: {collection.year}</p>
                    <p>크기: {collection.size}</p>
                    <p>표시순서: {collection.displayOrder}</p>
                  </div>
                  <p className="text-sm text-gray-700 line-clamp-2">{collection.description}</p>
                </div>

                <div className="flex-shrink-0 flex flex-col gap-2">
                  <Button
                    onClick={() => handleOpenEditCollectionForm(collection)}
                    variant="outline"
                    size="sm"
                    disabled={isCollectionLoading}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    수정
                  </Button>
                  <Button
                    onClick={() => handleDeleteCollection(collection.id)}
                    variant="destructive"
                    size="sm"
                    disabled={isCollectionLoading}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    삭제
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showCollectionForm && (
        <div className="border-t pt-6 mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingCollection ? '소장품 수정' : '새 소장품 추가'}
          </h3>

          <div className="space-y-4">
            <div>
              <Label htmlFor="collectionImage">작품 이미지{!editingCollection && ' *'}</Label>
              {collectionImagePreview && (
                <div className="mt-2 mb-3 border border-gray-300 rounded-md overflow-hidden inline-block">
                  <img
                    src={collectionImagePreview}
                    alt="미리보기"
                    className="w-48 h-48 object-cover"
                  />
                </div>
              )}
              <Input
                id="collectionImage"
                type="file"
                accept="image/*"
                onChange={handleCollectionImageChange}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                {editingCollection 
                  ? '이미지를 변경하지 않으려면 선택하지 마세요.' 
                  : '권장 크기: 1200x1200px 이상'}
              </p>
            </div>

            <div>
              <Label htmlFor="collectionTitle">작품명 *</Label>
              <Input
                id="collectionTitle"
                type="text"
                value={collectionForm.title}
                onChange={(e) => setCollectionForm({ ...collectionForm, title: e.target.value })}
                placeholder="예: 청송의 아침"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="collectionYear">제작연도 *</Label>
              <Input
                id="collectionYear"
                type="text"
                value={collectionForm.year}
                onChange={(e) => setCollectionForm({ ...collectionForm, year: e.target.value })}
                placeholder="예: 1985"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="collectionSize">크기 *</Label>
              <Input
                id="collectionSize"
                type="text"
                value={collectionForm.size}
                onChange={(e) => setCollectionForm({ ...collectionForm, size: e.target.value })}
                placeholder="예: 130 x 162 cm"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="collectionDescription">작품 설명 *</Label>
              <Textarea
                id="collectionDescription"
                value={collectionForm.description}
                onChange={(e) => setCollectionForm({ ...collectionForm, description: e.target.value })}
                placeholder="작품에 대한 설명을 입력하세요"
                rows={4}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="collectionDisplayOrder">표시순서 *</Label>
              <Input
                id="collectionDisplayOrder"
                type="number"
                value={collectionForm.displayOrder}
                onChange={(e) => setCollectionForm({ ...collectionForm, displayOrder: parseInt(e.target.value) || 0 })}
                placeholder="1"
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">낮은 숫자가 먼저 표시됩니다</p>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                onClick={editingCollection ? handleUpdateCollection : handleCreateCollection}
                disabled={isCollectionLoading}
                className="bg-teal-700 hover:bg-teal-800 text-white flex-1"
              >
                {isCollectionLoading ? '처리 중...' : (editingCollection ? '수정 완료' : '추가 완료')}
              </Button>
              <Button
                onClick={handleCancelCollectionForm}
                variant="outline"
                disabled={isCollectionLoading}
                className="flex-1"
              >
                취소
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
