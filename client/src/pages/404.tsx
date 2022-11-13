import Link from 'next/link';

export function ErrorPage() {
 return <main className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8">
 <div className="max-w-md mx-auto py-12 sm:py-20">
   <div className="text-center">
     <p className="text-xl font-semibold text-primary dark:text-primary-light">404</p>
     <h1 className="mt-2 text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight sm:text-4xl sm:tracking-tight">
       Page not found
     </h1>
     <p className="mt-2 text-lg text-slate-500 dark:text-slate-400">
       We can't find the page you're looking for
     </p>
   </div>
   <div className="mt-12 text-center">
     <Link href="/">
       <a className="text-sm font-medium text-primary hover:text-primary-dark dark:text-primary-light dark:hover:text-primary">
         <span aria-hidden="true"> &larr;</span> Back to main page
       </a>
     </Link>
   </div>
 </div>
</main>
}

export default function Error() {
  return <ErrorPage />;
}

Error.layoutProps = {
  meta: {
    title: '404',
  },
};
