import BookSections from '../../../src/components/search/book-sections';
import Books from '../../../src/models/books'
import Search from '../../../src/models/search'

describe('Search book sections', function() {

    describe('partsToOptions', function() {

        it('ignores units', () => {
            const search = new Search();
            Books.ensureLoaded = jest.fn()
            const props = { search: search };
            const bookSections = new BookSections(props);
            expect(bookSections.partsToOptions(
                [
                    {
                        id: 'db36053c-5281-42f4-90ec-afcc21ab28c3@18',
                        title: '<span data-type="" itemprop="" class="os-text">Preface</span>',
                        slug: 'preface',
                    },
                    {
                        id: '059c3388-24d1-5870-b79e-9f8e3dc123c5@16.179',
                        title: '<span class="os-number"><span class="os-part-text">Unit </span>1</span><span class="os-divider"> </span><span data-type="" itemprop="" class="os-text">The Chemistry of Life</span>',
                        contents: [
                            {
                                id: '519352ca-e6a9-5534-ae2c-3dd982bb17df@16.179',
                                title: '<span class="os-number"><span class="os-part-text">Chapter </span>1</span><span class="os-divider"> </span><span data-type="" itemprop="" class="os-text">The Study of Life</span>',
                                contents: [
                                    {
                                        id: '2230ab90-3137-4dcb-b6bd-72630222948c@10',
                                        title: '<span data-type="" itemprop="" class="os-text">Introduction</span>',
                                        slug: '1-introduction',
                                    },
                                    {
                                        id: 'ce6cfde4-1ac3-480f-aa0f-4777111f9e23@23',
                                        title: '<span class="os-number">1.1</span><span class="os-divider"> </span><span data-type="" itemprop="" class="os-text">The Science of Biology</span>',
                                        slug: '1-1-the-science-of-biology',
                                    },
                                    {
                                        id: '07dbec85-8530-4911-b863-5d73b5d7e211@18',
                                        title: '<span class="os-number">1.2</span><span class="os-divider"> </span><span data-type="" itemprop="" class="os-text">Themes and Concepts of Biology</span>',
                                        slug: '1-2-themes-and-concepts-of-biology',
                                    },
                                    {
                                        id: '761608a3-5b67-533e-a199-c03f0b88a95b@16.179',
                                        title: '<span class="os-text">Key Terms</span>',
                                        slug: '1-key-terms',
                                    },
                                    {
                                        id: '0d3ce2c6-8ebe-5f8e-b3d4-1c91cfca2a91@16.179',
                                        title: '<span class="os-text">Chapter Summary</span>',
                                        slug: '1-chapter-summary',
                                    },
                                    {
                                        id: '1c6c7f98-e992-536c-9769-cf24cefe451d@16.179',
                                        title: '<span class="os-text">Visual Connection Questions</span>',
                                        slug: '1-visual-connection-questions',
                                    },
                                    {
                                        id: '3eec7061-a32e-529d-a594-b9f53aed0331@16.179',
                                        title: '<span class="os-text">Review Questions</span>',
                                        slug: '1-review-questions',
                                    },
                                    {
                                        id: 'bbe32ad1-f92d-5f62-b911-4fde45c04a58@16.179',
                                        title: '<span class="os-text">Critical Thinking Questions</span>',
                                        slug: '1-critical-thinking-questions',
                                    },
                                ],
                                slug: '1-the-study-of-life',
                            },
                        ],
                    },
                ]
            )).toEqual([
                {
                    label: '<span data-type="" itemprop="" class="os-text">Preface</span>',
                    value: 'preface',
                },
                {
                    label: '<span class="os-number"><span class="os-part-text">Chapter </span>1</span><span class="os-divider"> </span><span data-type="" itemprop="" class="os-text">The Study of Life</span>',
                    options: [
                        {
                            label: '<span data-type="" itemprop="" class="os-text">Introduction</span>',
                            value: '1-introduction',
                        },
                        {
                            label: '<span class="os-number">1.1</span><span class="os-divider"> </span><span data-type="" itemprop="" class="os-text">The Science of Biology</span>',
                            value: '1-1-the-science-of-biology',
                        },
                        {
                            label: '<span class="os-number">1.2</span><span class="os-divider"> </span><span data-type="" itemprop="" class="os-text">Themes and Concepts of Biology</span>',
                            value: '1-2-themes-and-concepts-of-biology',
                        },
                        {
                            label: '<span class="os-text">Key Terms</span>',
                            value: '1-key-terms',
                        },
                        {
                            label: '<span class="os-text">Chapter Summary</span>',
                            value: '1-chapter-summary',
                        },
                        {
                            label: '<span class="os-text">Visual Connection Questions</span>',
                            value: '1-visual-connection-questions',
                        },
                        {
                            label: '<span class="os-text">Review Questions</span>',
                            value: '1-review-questions',
                        },
                        {
                            label: '<span class="os-text">Critical Thinking Questions</span>',
                            value: '1-critical-thinking-questions',
                        },
                    ],
                },
            ]);
        });

    });

});
