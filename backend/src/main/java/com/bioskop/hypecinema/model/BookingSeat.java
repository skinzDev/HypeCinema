package com.bioskop.hypecinema.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Entitet pojedinačnog sedišta u okviru rezervacije.
 * Svako sedište je definisano brojem reda i brojem sedišta u tom redu.
 */
@Entity
@Table(name = "booking_seats",
       uniqueConstraints = @UniqueConstraint(
           columnNames = {"screening_id", "row_num", "seat_num"}
       ))
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingSeat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    /**
     * Referenca na projekciju – koristi se za unique constraint
     * kako se isto sedište ne bi rezervisalo dva puta za istu projekciju.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "screening_id", nullable = false)
    private Screening screening;

    /** Broj reda (1-indexed) */
    @Column(name = "row_num", nullable = false)
    private Integer rowNum;

    /** Broj sedišta u redu (1-indexed) */
    @Column(name = "seat_num", nullable = false)
    private Integer seatNum;
}
