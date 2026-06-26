import "../css/Pagination.css"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
    entriesPerPage: number;
    totalEntries: number;
    setCurrentPage: (pageNumber: number) => void;
    currentPage: number;
}


const Pagination = ({
    entriesPerPage,
    totalEntries,
    setCurrentPage,
    currentPage,
}: PaginationProps) => {
    const totalPages = Math.ceil(totalEntries / entriesPerPage);

    const goToPage = (pageNumber: number) => {
        if (pageNumber < 1 || pageNumber > totalPages) return;
        setCurrentPage(pageNumber);
    };

    return (
        <nav aria-label="Pagination">
            <ul className="pagination d-flex justify-content-center align-items-center">
                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                    <button
                        type="button"
                        className="page-link previous-btn"
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        aria-label="Previous page"
                    >
                        <ChevronLeft size={16} />
                    </button>
                </li>

                <li className="page-item">
                    <span className="page-link" aria-current="page">
                        Page {currentPage} of {totalPages}
                    </span>
                </li>

                <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                    <button
                        type="button"
                        className="page-link next-btn"
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        aria-label="Next page"
                    >
                        <ChevronRight size={16} />
                    </button>
                </li>
            </ul>
        </nav>
    );
};

export default Pagination;
