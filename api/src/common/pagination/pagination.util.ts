import { SelectQueryBuilder } from "typeorm";
import { PaginationRequestDto } from "./dto/pagination-request.dto";
import { PaginationResponseDto } from "./dto/pagination-response.dto";

export async function paginate<T extends object>(
    queryBuilder: SelectQueryBuilder<T>,
    query: PaginationRequestDto,
): Promise<PaginationResponseDto<T>> {
    const { page, limit } = query;

    const [data, total] = await queryBuilder
        .skip((page - 1) * limit)
        .take(limit)
        .getManyAndCount();
        
    return {
        data,
        meta: {
            totalItems: total,
            itemCount: data.length,
            itemsPerPage: limit,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
        },
    };
}