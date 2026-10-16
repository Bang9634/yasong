import { useState, useEffect } from 'react';
import { collectionAPI } from '@/utils/api';
import type { Collection } from '../types';

export function useCollectionsList() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [yearFilter, setYearFilter] = useState<string>('전체');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pageInput, setPageInput] = useState('');
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set());
  const itemsPerPage = 10;
  // 카드 애니메이션을 위한 Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cardId = parseInt(entry.target.getAttribute('data-card-id') || '0');
            setVisibleCards((prev) => new Set(prev).add(cardId));
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    const cards = document.querySelectorAll('[data-card-id]');
    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, [collections]);

  // 서버로부터 소장품 로드
  const loadCollections = async () => {
    try {
      setLoading(true);

      // 연도 필터 범위 계산
      let yearFrom: string | undefined;
      let yearTo: string | undefined;

      if (yearFilter !== '전체') {
        switch (yearFilter) {
          case '1980년 이전':
            yearTo = '1979';
            break;
          case '1980-1989년':
            yearFrom = '1980';
            yearTo = '1989';
            break;
          case '1990-1994년':
            yearFrom = '1990';
            yearTo = '1994';
            break;
          case '1995-1999년':
            yearFrom = '1995';
            yearTo = '1999';
            break;
          case '2000-2004년':
            yearFrom = '2000';
            yearTo = '2004';
            break;
          case '2005-2019년':
            yearFrom = '2005';
            yearTo = '2019';
            break;
        }
      }

      const response = await collectionAPI.getCollections({
        page: currentPage,
        limit: itemsPerPage,
        search: searchQuery || undefined,
        yearFrom,
        yearTo,
      });

      console.log('🔍 [CollectionsPage] API Response:', response);

      // Spring Page 객체 처리 (content, totalPages, totalElements)
      const data = response.data || response.content || [];
      const pages = response.totalPages || 1;
      const total = response.total || response.totalElements || 0;

      setCollections(data);
      setTotalPages(pages);
      setTotalCount(total);
    } catch (error) {
      console.error('Failed to load collections:', error);
      // 에러 발생 시 빈 배열로 초기화
      setCollections([]);
      setTotalPages(1);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  // 페이지, 검색, 필터 변경 시 데이터 재로드
  useEffect(() => {
    setVisibleCards(new Set()); // 애니메이션 초기화
    loadCollections();
  }, [currentPage, searchQuery, yearFilter]);

  // 검색어나 필터 변경 시 1페이지로 리셋
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [searchQuery, yearFilter]);

  // 페이지 변경 시 맨 위로 스크롤
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const handleDelete = async (id: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      await collectionAPI.deleteCollection(String(id));
      alert('작품이 삭제되었습니다.');
      loadCollections();
    } catch (error) {
      console.error('Failed to delete collection:', error);
      alert('작품 삭제에 실패했습니다.');
    }
  };

  return {
    collections,
    searchQuery,
    setSearchQuery,
    yearFilter,
    setYearFilter,
    currentPage,
    setCurrentPage,
    totalPages,
    totalCount,
    loading,
    pageInput,
    setPageInput,
    visibleCards,
    handleDelete,
    loadCollections,
  };
}
