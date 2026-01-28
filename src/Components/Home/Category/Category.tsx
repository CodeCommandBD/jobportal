import { Grid } from 'lucide-react';
import SectionHeading from '@/Components/helpers/SectionHeading';
import CategoryCard from './CategoryCard';
import { useCategoryCounts } from '@/hooks/useCategoryCounts';
import { CategorySkeleton } from '@/Components/helpers/SkeletonLoader';

const Category = () => {
    const { data: categories = [], isLoading } = useCategoryCounts();

  return (
    <div className='pt-16 pb-16'>
        <SectionHeading heading={'Popular Job Categories'} subheading='Explore dynamic job categories with real-time vacancy counts.'></SectionHeading>
        <div className='mt-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 max-w-6xl mx-auto p-4'>
            {
                isLoading ? (
                    Array.from({ length: 8 }).map((_, i) => (
                        <CategorySkeleton key={i} />
                    ))
                ) : (
                    categories?.map((item: any, i: number)=>(
                        <div 
                        className='' 
                        key={item._id}
                        data-aos='fade-right'
                        data-aos-anchor-placement ='top-center'
                        data-aos-delay={i * 100}
                        >
                            <CategoryCard item={{
                                id: item._id,
                                categoryName: item.name,
                                openPositions: item.count,
                                icon: <Grid className='w-10 h-10 text-purple-600 dark:text-white' />
                            }}></CategoryCard>
                        </div>
                    ))
                )
            }
        </div>
        {categories.length === 0 && !isLoading && (
            <div className="text-center text-gray-500">No categories added yet.</div>
        )}
    </div>
  )
}

export default Category