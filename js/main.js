class PhotoGallery {
    constructor() {
        this.photos = JSON.parse(localStorage.getItem('photos')) || [];
        this.currentCategory = 'all';
        this.loveStartDate = new Date('2024-10-15T00:00:00');
        this.selectedUploadCategory = null;
        this.selectedDescription = '';
        this.init();
        console.log('PhotoGallery initialized');
    }

    init() {
        try {
            this.updateDateDisplay();
            this.setupEventListeners();
            this.renderGallery();
            this.startLoveCounter();
            console.log('Initialization completed');
        } catch (error) {
            console.error('Initialization error:', error);
        }
    }

    updateDateDisplay() {
        const dateDisplay = document.getElementById('dateDisplay');
        if (!dateDisplay) {
            console.error('Date display element not found');
            return;
        }
        
        const updateDate = () => {
            const now = new Date();
            const options = { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric', 
                weekday: 'long'
            };
            dateDisplay.textContent = now.toLocaleDateString('zh-CN', options);
        };
        
        updateDate();
        setInterval(updateDate, 1000);
    }

    startLoveCounter() {
        const updateCounter = () => {
            const now = new Date();
            const diff = this.loveStartDate - now;

            if (diff > 0) {
                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((diff % (1000 * 60)) / 1000);

                document.querySelector('.love-title').textContent = '距离我们相识还有';
                document.getElementById('loveDays').textContent = days;
                document.getElementById('loveHours').textContent = hours;
                document.getElementById('loveMinutes').textContent = minutes;
                document.getElementById('loveSeconds').textContent = seconds;
            } else {
                const positiveDiff = Math.abs(diff);
                const days = Math.floor(positiveDiff / (1000 * 60 * 60 * 24));
                const hours = Math.floor((positiveDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((positiveDiff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((positiveDiff % (1000 * 60)) / 1000);

                document.querySelector('.love-title').textContent = '我们相识已经';
                document.getElementById('loveDays').textContent = days;
                document.getElementById('loveHours').textContent = hours;
                document.getElementById('loveMinutes').textContent = minutes;
                document.getElementById('loveSeconds').textContent = seconds;
            }
        };

        updateCounter();
        setInterval(updateCounter, 1000);
    }

    setupEventListeners() {
        const uploadBtn = document.getElementById('uploadBtn');
        const imageUpload = document.getElementById('imageUpload');
        const navLinks = document.querySelectorAll('.nav-link');
        const modal = document.getElementById('categoryModal');
        const categoryOptions = document.querySelectorAll('.category-option');
        const uploadDateTime = document.getElementById('uploadDateTime');

        if (!uploadBtn || !imageUpload) {
            console.error('Upload elements not found');
            return;
        }

        // 设置默认时间为当前时间
        const now = new Date();
        uploadDateTime.value = this.formatDateForInput(now);

        // 导航栏链接事件
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                this.currentCategory = link.dataset.category;
                this.renderGallery();
            });
        });

        // 上传按钮点击事件
        uploadBtn.addEventListener('click', () => {
            console.log('Upload button clicked');
            modal.classList.add('show');
        });

        // 分类选择事件
        categoryOptions.forEach(option => {
            option.addEventListener('click', () => {
                categoryOptions.forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
                this.selectedUploadCategory = option.dataset.category;
                const selectedTime = uploadDateTime.value;
                const description = document.getElementById('uploadDescription').value.trim();
                if (!selectedTime) {
                    alert('请选择时间！');
                    return;
                }
                modal.classList.remove('show');
                this.selectedDescription = description;
                imageUpload.click();
            });
        });

        // 文件选择事件
        imageUpload.addEventListener('change', (e) => {
            console.log('File input changed');
            if (this.selectedUploadCategory) {
                const selectedTime = uploadDateTime.value;
                this.handleImageUpload(e, this.selectedUploadCategory, selectedTime);
                this.selectedUploadCategory = null;
            }
        });

        // 点击弹窗外部关闭
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
            }
        });
    }

    formatDateForInput(date) {
        const d = new Date(date);
        return d.toISOString().slice(0, 16);
    }

    getCategoryText(category) {
        const categoryMap = {
            'contact': '我们的联系方式',
            'food': '我们吃的美食',
            'places': '我们去玩的地方',
            'future': '我们计划的未来'
        };
        return categoryMap[category] || category;
    }

    handleImageUpload(event, category, timestamp) {
        const files = event.target.files;
        if (!files || files.length === 0) {
            console.log('No files selected');
            return;
        }

        console.log(`Processing ${files.length} files for category: ${category}`);
        Array.from(files).forEach(file => {
            if (!file.type.startsWith('image/')) {
                console.log(`Skipping non-image file: ${file.name}`);
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                const photo = {
                    id: Date.now(),
                    imageUrl: e.target.result,
                    description: this.selectedDescription || '',
                    timestamp: new Date(timestamp).toISOString(),
                    category: category,
                    comments: []
                };
                this.photos.unshift(photo);
                this.savePhotos();
                this.renderGallery();
                console.log('Photo added successfully');
                
                document.getElementById('uploadDescription').value = '';
                this.selectedDescription = '';
            };

            reader.onerror = (error) => {
                console.error('Error reading file:', error);
            };

            reader.readAsDataURL(file);
        });
    }

    savePhotos() {
        try {
            localStorage.setItem('photos', JSON.stringify(this.photos));
            console.log('Photos saved to localStorage');
        } catch (error) {
            console.error('Error saving photos:', error);
        }
    }

    renderGallery() {
        const gallery = document.getElementById('gallery');
        const template = document.getElementById('photoTemplate');
        
        if (!gallery || !template) {
            console.error('Gallery elements not found');
            return;
        }
        
        gallery.innerHTML = '';
        console.log(`Rendering ${this.photos.length} photos`);
        
        const filteredPhotos = this.currentCategory === 'all' 
            ? this.photos 
            : this.photos.filter(photo => photo.category === this.currentCategory);
        
        filteredPhotos.forEach(photo => {
            const clone = template.content.cloneNode(true);
            
            const img = clone.querySelector('.photo-image');
            img.src = photo.imageUrl;
            
            const category = clone.querySelector('.photo-category');
            category.textContent = this.getCategoryText(photo.category);
            
            const dateDisplay = clone.querySelector('.photo-date');
            dateDisplay.textContent = new Date(photo.timestamp).toLocaleString('zh-CN');
            
            const description = clone.querySelector('.photo-description');
            description.textContent = photo.description;
            description.addEventListener('input', (e) => {
                photo.description = e.target.textContent;
                this.savePhotos();
            });
            
            const commentsList = clone.querySelector('.comments-list');
            if (photo.comments) {
                photo.comments.forEach(comment => {
                    const commentElement = document.createElement('div');
                    commentElement.className = 'comment';
                    commentElement.innerHTML = `
                        <div class="comment-text">${comment.text}</div>
                        <div class="comment-time">${new Date(comment.timestamp).toLocaleString('zh-CN')}</div>
                    `;
                    commentsList.appendChild(commentElement);
                });
            }

            const commentInput = clone.querySelector('.comment-input');
            const commentSubmit = clone.querySelector('.comment-submit');
            commentSubmit.addEventListener('click', () => {
                const text = commentInput.value.trim();
                if (text) {
                    this.addComment(photo.id, text);
                    commentInput.value = '';
                }
            });

            commentInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const text = commentInput.value.trim();
                    if (text) {
                        this.addComment(photo.id, text);
                        commentInput.value = '';
                    }
                }
            });
            
            const categorySelect = clone.querySelector('.category-select');
            categorySelect.value = photo.category;
            categorySelect.addEventListener('change', (e) => {
                photo.category = e.target.value;
                this.savePhotos();
                this.renderGallery();
            });
            
            const deleteBtn = clone.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', () => {
                if (confirm('确定要删除这张照片吗？')) {
                    this.photos = this.photos.filter(p => p.id !== photo.id);
                    this.savePhotos();
                    this.renderGallery();
                    console.log('Photo deleted');
                }
            });
            
            gallery.appendChild(clone);
        });
    }

    addComment(photoId, commentText) {
        const photo = this.photos.find(p => p.id === photoId);
        if (photo) {
            const comment = {
                id: Date.now(),
                text: commentText,
                timestamp: new Date().toISOString()
            };
            if (!photo.comments) {
                photo.comments = [];
            }
            photo.comments.push(comment);
            this.savePhotos();
            this.renderGallery();
        }
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    try {
        window.photoGallery = new PhotoGallery();
        console.log('PhotoGallery application started');
    } catch (error) {
        console.error('Application startup error:', error);
    }
});
