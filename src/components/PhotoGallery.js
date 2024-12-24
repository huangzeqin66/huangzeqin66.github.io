import React, { useState, useEffect } from 'react';
import Masonry from 'react-masonry-css';
import styled from '@emotion/styled';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';

const GalleryContainer = styled.div`
  padding: 20px;
`;

const MasonryGrid = styled(Masonry)`
  display: flex;
  margin-left: -20px;
  width: auto;
`;

const PhotoItem = styled.div`
  margin: 0 0 20px 20px;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
`;

const Image = styled.img`
  width: 100%;
  height: auto;
  display: block;
`;

const PhotoInfo = styled.div`
  padding: 15px;
`;

const breakpointColumns = {
  default: 4,
  1100: 3,
  700: 2,
  500: 1
};

const PhotoGallery = () => {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    const q = query(collection(db, 'photos'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const photoData = [];
      snapshot.forEach(doc => {
        photoData.push({ id: doc.id, ...doc.data() });
      });
      setPhotos(photoData);
    });

    return () => unsubscribe();
  }, []);

  return (
    <GalleryContainer>
      <MasonryGrid
        breakpointCols={breakpointColumns}
        className="masonry-grid"
        columnClassName="masonry-grid_column"
      >
        {photos.map(photo => (
          <PhotoItem key={photo.id}>
            <Image 
              src={photo.imageUrl} 
              alt={photo.description}
              loading="lazy"
            />
            <PhotoInfo>
              <p>{format(photo.timestamp.toDate(), 'yyyy-MM-dd HH:mm')}</p>
              <p>{photo.description}</p>
            </PhotoInfo>
          </PhotoItem>
        ))}
      </MasonryGrid>
    </GalleryContainer>
  );
};

export default PhotoGallery; 