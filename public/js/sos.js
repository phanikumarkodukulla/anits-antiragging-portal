// SOS Alert Functionality

document.addEventListener('DOMContentLoaded', function () {
    const sosButton = document.getElementById('sosButton');

    if (sosButton) {
        sosButton.addEventListener('click', function () {
            if (confirm('⚠️ EMERGENCY SOS ALERT\n\nThis will immediately notify campus security and administrators.\n\nPress OK only if you are in immediate danger or witnessing a ragging incident.\n\nDo you want to proceed?')) {
                triggerSOSAlert();
            }
        });
    }
});

function triggerSOSAlert() {
    // Show loading state
    const sosButton = document.getElementById('sosButton');
    const originalContent = sosButton.innerHTML;
    sosButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    sosButton.disabled = true;

    // Try to get geolocation
    let locationData = 'Location unavailable';

    const sendAlert = (location) => {
        fetch('/sos/alert', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                location: location,
                timestamp: new Date().toISOString()
            })
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Show success message
                    showSOSSuccess(data.alertId);
                } else {
                    showSOSError();
                }
            })
            .catch(error => {
                console.error('SOS Alert Error:', error);
                showSOSError();
            })
            .finally(() => {
                // Restore button
                sosButton.innerHTML = originalContent;
                sosButton.disabled = false;
            });
    };

    // Try to get location with timeout
    if (navigator.geolocation) {
        const timeoutId = setTimeout(() => {
            sendAlert(locationData);
        }, 3000); // 3 second timeout

        navigator.geolocation.getCurrentPosition(
            (position) => {
                clearTimeout(timeoutId);
                locationData = `Lat: ${position.coords.latitude.toFixed(6)}, Lon: ${position.coords.longitude.toFixed(6)}`;
                sendAlert(locationData);
            },
            (error) => {
                clearTimeout(timeoutId);
                console.log('Geolocation error:', error);
                sendAlert(locationData);
            }
        );
    } else {
        sendAlert(locationData);
    }
}

function showSOSSuccess(alertId) {
    const modal = document.createElement('div');
    modal.className = 'modal fade show';
    modal.style.display = 'block';
    modal.style.backgroundColor = 'rgba(0,0,0,0.7)';
    modal.innerHTML = `
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content border-0 shadow-lg">
        <div class="modal-header bg-success text-white border-0">
          <h5 class="modal-title">
            <i class="fas fa-check-circle me-2"></i>SOS Alert Sent Successfully
          </h5>
        </div>
        <div class="modal-body text-center p-4">
          <i class="fas fa-shield-alt fa-4x text-success mb-3"></i>
          <h4 class="mb-3">Help is on the way!</h4>
          <p class="mb-3">Your emergency alert has been sent to campus security and administrators.</p>
          <div class="alert alert-info">
            <strong>Alert ID:</strong> <code>${alertId}</code>
          </div>
          <p class="small text-muted mb-0">
            <i class="fas fa-info-circle me-1"></i>
            If you are in immediate danger, please also call:<br>
            <strong>Campus Security: +91-XXXX-XXXXXX</strong><br>
            <strong>Emergency Helpline: 1800-XXX-XXXX</strong>
          </p>
        </div>
        <div class="modal-footer border-0">
          <button type="button" class="btn btn-success" onclick="closeSOSModal()">OK</button>
        </div>
      </div>
    </div>
  `;
    document.body.appendChild(modal);

    // Play alert sound (optional)
    try {
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYHGGS57OeeSwwLT6fj8LVfGgU3kNfyz3UqBSl3x+3dkUEKE1606+inVBMJQ5/e8r5sIAQogc3y2YkzBxhmuOznm0oLCU+k4+CyXBoFN47U8tN2KwUneMjt3Y9BCBNW2+jnp1UTCUCe3PK+cCAEKH/N89iKNQcZZrjq551LCwlNqOPpsVwbBTaO1fPSdS0FKXXI7N+RQQsTVNvo6KeVFAlAnNzyv3EgBCh/zfPZijYGGGe46OeiTgsJTaXj6rFaGwU2jdPz03QrBSl0x+zej0ILElPb6einlhQJP5zd88BxIAQngMzz2Ik3Bhhmturqo04MCU2l4+qyWRsGNo3T89J1KwUpdMfs35BBChJT2+jop5YUCj+c3fPAcCAEJ4DM89mJNwYZZrbq6qRODAlMpePqslkbBTaM0/PTdSsFKXPH7N+RQQoSU9vo6KeWEwo/m93zwHAgBCeAzPPZiTcGGWW37OukTgwJTKXj6rFZGgU1jdPz03UqBSlyxuzfkEELE1Lb6OemliQKPpzc88BwIAQngM31');
        audio.play().catch(e => console.log('Audio play failed:', e));
    } catch (e) {
        console.log('Audio not supported:', e);
    }
}

function showSOSError() {
    const modal = document.createElement('div');
    modal.className = 'modal fade show';
    modal.style.display = 'block';
    modal.style.backgroundColor = 'rgba(0,0,0,0.7)';
    modal.innerHTML = `
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content border-0 shadow-lg">
        <div class="modal-header bg-danger text-white border-0">
          <h5 class="modal-title">
            <i class="fas fa-exclamation-triangle me-2"></i>Alert Failed
          </h5>
        </div>
        <div class="modal-body text-center p-4">
          <i class="fas fa-times-circle fa-4x text-danger mb-3"></i>
          <h4 class="mb-3">Failed to send SOS alert</h4>
          <p class="mb-3">Please call emergency services directly:</p>
          <div class="alert alert-danger">
            <strong>Campus Security:</strong> +91-XXXX-XXXXXX<br>
            <strong>Emergency Helpline:</strong> 1800-XXX-XXXX
          </div>
        </div>
        <div class="modal-footer border-0">
          <button type="button" class="btn btn-danger" onclick="closeSOSModal()">Close</button>
        </div>
      </div>
    </div>
  `;
    document.body.appendChild(modal);
}

function closeSOSModal() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => modal.remove());
}

// Close modal when clicking outside
document.addEventListener('click', function (event) {
    if (event.target.classList.contains('modal')) {
        closeSOSModal();
    }
});
