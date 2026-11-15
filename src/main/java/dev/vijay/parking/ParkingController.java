package dev.vijay.parking;

import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/parking")
public class ParkingController {
    private final ParkingService parking;

    public ParkingController(ParkingService parking) { this.parking = parking; }

    @PostMapping("/enter")
    public ParkingService.Ticket enter(@RequestBody PlateRequest request) {
        return parking.enter(request.plate());
    }

    @PostMapping("/exit")
    public ParkingService.Receipt exit(@RequestBody PlateRequest request) {
        return parking.exit(request.plate());
    }

    @GetMapping("/vehicles")
    public List<ParkingService.Ticket> vehicles() { return parking.parked(); }

    @GetMapping("/availability")
    public Map<String, Integer> availability() { return Map.of("freeSlots", parking.freeSlots()); }

    @ExceptionHandler(ParkingService.ParkingException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, String> problem(ParkingService.ParkingException error) {
        return Map.of("error", error.getMessage());
    }

    public record PlateRequest(String plate) {}
}
